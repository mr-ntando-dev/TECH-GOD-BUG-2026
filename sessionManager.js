/**
 * 🐛 Tech God Bug 2026 v2.5.0.5.7 — Multi-User Session Manager
 *
 * Manages multiple independent Baileys bot instances.
 * Each user has their own isolated session directory, socket, and state.
 *
 * sessions/<phone>/   <- Baileys auth state files
 *
 * By Dev-Ntando
 */
'use strict';

const fs   = require('fs');
const path = require('path');
const pino = require('pino');

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require('baileys');

const config    = require('./config');
const antiban   = require('./utils/antiban');
const handler   = require('./handler');
const { decodeSession, clearSession } = require('./utils/session');
const welcomeMod  = require('./commands/group/welcome');
const autoProtect = require('./utils/autoprotect');

// ── Root directory for all user sessions ─────────────────────────────────────
const SESSIONS_ROOT = path.resolve(process.env.SESSIONS_ROOT || './sessions');
if (!fs.existsSync(SESSIONS_ROOT)) fs.mkdirSync(SESSIONS_ROOT, { recursive: true });

// ── WA version cache ─────────────────────────────────────────────────────────
let _cachedVersion    = null;
let _versionFetchedAt = 0;
const VERSION_TTL_MS  = 6 * 60 * 60 * 1000;

async function _getVersion() {
  if (_cachedVersion && (Date.now() - _versionFetchedAt) < VERSION_TTL_MS) return _cachedVersion;
  try {
    const { version } = await fetchLatestBaileysVersion();
    _cachedVersion    = version;
    _versionFetchedAt = Date.now();
    _log('WA version:', version.join('.'));
  } catch (e) {
    if (!_cachedVersion) _cachedVersion = [2, 24, 6];
    _log('fetchLatestBaileysVersion failed, using fallback:', e.message);
  }
  return _cachedVersion;
}

// ── In-memory registry ───────────────────────────────────────────────────────
const _bots = new Map();

// ── Helpers ───────────────────────────────────────────────────────────────────
function _log(...args) { console.log('[SessionManager]', ...args); }

function _sessionDir(phone) {
  return path.join(SESSIONS_ROOT, phone);
}

function maskPhone(phone) {
  if (!phone) return '—';
  const s = String(phone);
  if (s.length <= 6) return '+' + s;
  return '+' + s.slice(0, 3) + '***' + s.slice(-4);
}

// ── Boot all previously-saved sessions on startup ─────────────────────────────
async function bootSavedSessions() {
  await _getVersion();

  if (!fs.existsSync(SESSIONS_ROOT)) return;
  const dirs = fs.readdirSync(SESSIONS_ROOT).filter(d =>
    fs.statSync(path.join(SESSIONS_ROOT, d)).isDirectory()
  );

  _log(`Found ${dirs.length} saved session(s)`);

  for (const phone of dirs) {
    try {
      await createBot(phone);
    } catch (e) {
      _log(`Failed to boot session ${maskPhone(phone)}:`, e.message);
    }
  }
}

// ── Create / connect a bot instance ──────────────────────────────────────────
async function createBot(phone, options) {
  // options: { usePairCode: true/false, resolve, reject }
  if (_bots.has(phone) && !_bots.get(phone).destroyed) {
    const existing = _bots.get(phone);
    if (existing.connected) return existing;
  }

  const sessionDir = _sessionDir(phone);
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

  const bot = {
    phone,
    sessionDir,
    connected: false,
    socketReady: false,
    number: phone,
    socket: null,
    qr: null,
    qrResolve: null,
    startedAt: Date.now(),
    attempt: 0,
    destroyed: false,
  };

  _bots.set(phone, bot);
  await _connectSocket(bot, options);
  return bot;
}

// ── Internal socket connection ───────────────────────────────────────────────
async function _connectSocket(bot, options) {
  if (bot.destroyed) return;

  bot.attempt++;
  const version = await _getVersion();
  const { state, saveCreds } = await useMultiFileAuthState(bot.sessionDir);

  const logger = pino({ level: 'silent' });

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: ['Tech God Bug 2026', 'Chrome', '120.0.0'],
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 25000,
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: false,
    syncFullHistory: false,
    markOnlineOnConnect: true,
  });

  bot.socket = sock;

  // ── Request pairing code immediately if needed (before connection opens) ──
  if (options && options.usePairCode && !state.creds?.registered) {
    try {
      // Small delay to let the socket initialize
      await new Promise(r => setTimeout(r, 3000));
      const code = await sock.requestPairingCode(bot.phone);
      _log(`Pairing code for ${maskPhone(bot.phone)}: ${code}`);
      if (options.resolve) options.resolve(code);
    } catch (e) {
      _log(`Pairing code request failed for ${maskPhone(bot.phone)}:`, e.message);
      if (options.reject) options.reject(e);
    }
  }

  // ── Credentials update ─────────────────────────────────────────────────────
  sock.ev.on('creds.update', saveCreds);

  // ── Connection update ──────────────────────────────────────────────────────
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      bot.qr = qr;
      _log(`QR generated for ${maskPhone(bot.phone)}`);
      // Resolve QR promise if someone is waiting for it
      if (bot.qrResolve) {
        bot.qrResolve(qr);
        bot.qrResolve = null;
      }
    }

    if (connection === 'open') {
      bot.connected   = true;
      bot.socketReady = true;
      bot.qr          = null;
      bot.attempt     = 0;
      const me = sock.user?.id?.split(':')[0] || bot.phone;
      bot.number = me;
      _log(`✅ Connected: ${maskPhone(me)}`);
    }

    if (connection === 'close') {
      bot.connected   = false;
      bot.socketReady = false;

      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      if (statusCode === DisconnectReason.loggedOut) {
        _log(`Session logged out: ${maskPhone(bot.phone)}`);
        clearSession(bot.sessionDir);
        bot.destroyed = true;
        _bots.delete(bot.phone);
        return;
      }

      if (shouldReconnect && !bot.destroyed) {
        const delay = antiban.reconnectDelay(bot.attempt);
        _log(`Reconnecting ${maskPhone(bot.phone)} in ${Math.round(delay/1000)}s (attempt ${bot.attempt})`);
        setTimeout(() => _connectSocket(bot), delay);
      }
    }
  });

  // ── Message handler ────────────────────────────────────────────────────────
  sock.ev.on('messages.upsert', async (m) => {
    if (!m.messages || !m.messages.length) return;
    for (const msg of m.messages) {
      if (!msg.message) continue;
      if (msg.key.fromMe) continue;
      try {
        await handler(sock, msg, bot);
      } catch (e) {
        console.error('[Handler Error]', e.message);
      }
    }
  });

  // ── Group participants update (welcome/goodbye) ────────────────────────────
  sock.ev.on('group-participants.update', async (update) => {
    try {
      await welcomeMod.handleGroupUpdate(sock, update);
    } catch {}
  });
}

// ── Get QR for a session (creates bot if needed, waits for QR) ───────────────
async function getQR(phone) {
  let bot = _bots.get(phone);

  // If bot already has a QR cached, return it
  if (bot && bot.qr) return bot.qr;

  // If bot is already connected, no QR needed
  if (bot && bot.connected) return null;

  // Create bot if it doesn't exist
  if (!bot || bot.destroyed) {
    bot = await createBot(phone);
  }

  // If QR is already available after createBot
  if (bot.qr) return bot.qr;

  // Wait for QR to be generated (up to 30s)
  return new Promise((resolve) => {
    bot.qrResolve = resolve;
    setTimeout(() => {
      if (bot.qrResolve === resolve) {
        bot.qrResolve = null;
        resolve(bot.qr || null);
      }
    }, 30000);
  });
}

// ── Destroy a session ────────────────────────────────────────────────────────
async function destroySession(phone) {
  const bot = _bots.get(phone);
  if (!bot) return false;
  bot.destroyed = true;
  try { bot.socket?.end(); } catch {}
  clearSession(bot.sessionDir);
  _bots.delete(phone);
  _log(`Destroyed session: ${maskPhone(phone)}`);
  return true;
}

// ── Public getters ───────────────────────────────────────────────────────────
function getBot(phone)  { return _bots.get(phone) || null; }
function getAllBots()    { return Array.from(_bots.values()); }

module.exports = {
  bootSavedSessions,
  createBot,
  destroySession,
  getBot,
  getAllBots,
  getQR,
  maskPhone,
};
