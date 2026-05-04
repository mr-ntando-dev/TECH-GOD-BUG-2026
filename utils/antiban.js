/**
 * 🐛 Tech God Bug 2026 — Anti-Ban Engine
 * Mimics real human WhatsApp behaviour to reduce ban risk.
 * By Dev-Ntando
 */
'use strict';

const MIN_TYPING_MS   = 600;
const MAX_TYPING_MS   = 2800;
const CHARS_PER_SEC   = 18;
const MIN_SEND_GAP_MS = 1200;
const READ_JITTER_MS  = 400;

let _lastSentAt = 0;

function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function _jitter(range) { return Math.floor(Math.random() * range); }

async function _enforceGap() {
  const now  = Date.now();
  const wait = MIN_SEND_GAP_MS - (now - _lastSentAt);
  if (wait > 0) await _sleep(wait + _jitter(200));
  _lastSentAt = Date.now();
}

function typingDuration(text) {
  const len = (text || '').length;
  const raw = (len / CHARS_PER_SEC) * 1000;
  return Math.min(Math.max(raw + _jitter(400), MIN_TYPING_MS), MAX_TYPING_MS);
}

async function sendHuman(sock, jid, content, opts) {
  await _enforceGap();
  const text = content.text || content.caption || '';

  try { await sock.sendPresenceUpdate('composing', jid); } catch {}
  await _sleep(typingDuration(text) + _jitter(300));

  let result;
  try {
    result = await sock.sendMessage(jid, content, opts || {});
  } finally {
    try { await sock.sendPresenceUpdate('paused', jid); } catch {}
  }
  return result;
}

async function readWithJitter(sock, keys) {
  await _sleep(_jitter(READ_JITTER_MS));
  try { await sock.readMessages(keys); } catch {}
}

function reconnectDelay(attempt) {
  const base = Math.min(30000, 2000 * Math.pow(2, attempt));
  return base + _jitter(3000);
}

module.exports = { sendHuman, readWithJitter, reconnectDelay, typingDuration };
