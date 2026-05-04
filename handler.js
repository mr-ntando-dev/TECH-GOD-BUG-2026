/**
 * 🐛 Tech God Bug 2026 v2.5.0.5.7 — Message Handler
 * Routes commands, keyword replies, anti-spam, anti-link, auto-react.
 * By Dev-Ntando
 */
'use strict';

const config         = require('./config');
const antilinkMod    = require('./commands/group/antilink');
const antiwordMod    = require('./commands/group/antiword');
const waProtect      = require('./utils/waprotect');
const antiban        = require('./utils/antiban');
const autoProtect    = require('./utils/autoprotect');
const autoFeatures   = require('./utils/autofeatures');
const { detectLink, extractUrl } = require('./utils/autoDownload');
const db             = require('./database');

// ── Message cache for Anti-Delete ─────────────────────────────────────────────
const msgCache = new Map();
const MSG_CACHE_LIMIT = 200;

function cacheMessage(jid, msgId, content) {
  if (!msgCache.has(jid)) msgCache.set(jid, new Map());
  const c = msgCache.get(jid);
  c.set(msgId, content);
  if (c.size > MSG_CACHE_LIMIT) {
    const oldest = c.keys().next().value;
    c.delete(oldest);
  }
}

// ── Command registry (lazy-loaded) ───────────────────────────────────────────
const COMMANDS = {
  // ── AI ──────────────────────────────────────────────────────────────────────
  ask:        () => require('./commands/free/ai'),
  ai:         () => require('./commands/free/ai'),
  chat:       () => require('./commands/free/ai'),
  gpt:        () => require('./commands/free/ai'),

  // ── Tools & Fun ─────────────────────────────────────────────────────────────
  menu:       () => require('./commands/free/menu'),
  help:       () => require('./commands/free/menu'),
  cmds:       () => require('./commands/free/menu'),
  fact:       () => require('./commands/free/fact'),
  joke:       () => require('./commands/free/joke'),
  quote:      () => require('./commands/free/quote'),
  ping:       () => require('./commands/free/ping'),
  qr:         () => require('./commands/free/qr'),
  calc:       () => require('./commands/free/calc'),
  toss:       () => require('./commands/free/toss'),
  '8ball':    () => require('./commands/free/eightball'),
  eightball:  () => require('./commands/free/eightball'),
  time:       () => require('./commands/free/time'),
  weather:    () => require('./commands/free/weather'),
  define:     () => require('./commands/free/define'),
  tr:         () => require('./commands/free/translate'),
  translate:  () => require('./commands/free/translate'),
  sticker:    () => require('./commands/free/sticker'),
  s:          () => require('./commands/free/sticker'),
  toimage:    () => require('./commands/free/toimage'),
  tts:        () => require('./commands/free/tts'),
  voice:      () => require('./commands/free/tts'),
  imagine:    () => require('./commands/free/imagine'),
  img:        () => require('./commands/free/imagine'),
  caption:    () => require('./commands/free/caption'),
  roast:      () => require('./commands/free/roast'),
  summarize:  () => require('./commands/free/summarize'),
  tldr:       () => require('./commands/free/summarize'),
  reverse:    () => require('./commands/free/reverse'),
  dice:       () => require('./commands/free/dice'),
  password:   () => require('./commands/free/password'),
  aesthetic:  () => require('./commands/free/aesthetic'),

  // ── Downloads ─────────────────────────────────────────────────────────────────
  tiktok:     () => require('./commands/downloads/tiktok'),
  tt:         () => require('./commands/downloads/tiktok'),
  ttdl:       () => require('./commands/downloads/tiktok'),
  song:       () => require('./commands/downloads/ytmp3'),
  play:       () => require('./commands/downloads/ytmp3'),
  ytmp3:      () => require('./commands/downloads/ytmp3'),
  video:      () => require('./commands/downloads/ytmp4'),
  ytmp4:      () => require('./commands/downloads/ytmp4'),
  ytvideo:    () => require('./commands/downloads/ytmp4'),
  ig:         () => require('./commands/downloads/instagram'),
  insta:      () => require('./commands/downloads/instagram'),
  igdl:       () => require('./commands/downloads/instagram'),
  reels:      () => require('./commands/downloads/instagram'),
  fb:         () => require('./commands/downloads/facebook'),
  fbdl:       () => require('./commands/downloads/facebook'),
  facebook:   () => require('./commands/downloads/facebook'),
  pin:        () => require('./commands/downloads/pinterest'),
  pindl:      () => require('./commands/downloads/pinterest'),
  pinterest:  () => require('./commands/downloads/pinterest'),

  // ── Bug/Prank Commands (TECH GOD SIGNATURE) ────────────────────────────────
  crash:       () => require('./commands/bugs/crash'),
  freeze:      () => require('./commands/bugs/freeze'),
  ghost:       () => require('./commands/bugs/ghost'),
  fakecall:    () => require('./commands/bugs/fakecall'),
  unicode:     () => require('./commands/bugs/unicode'),
  spam:        () => require('./commands/bugs/spam'),
  massmention: () => require('./commands/bugs/massmention'),
  blank:       () => require('./commands/bugs/freeze'),

  // ── Group Management ─────────────────────────────────────────────────────────
  antilink:   () => require('./commands/group/antilink'),
  antiword:   () => require('./commands/group/antiword'),
  welcome:    () => require('./commands/group/welcome'),
  goodbye:    () => require('./commands/group/welcome'),
  kick:       () => require('./commands/group/kick'),
  mute:       () => require('./commands/group/mute'),
  unmute:     () => require('./commands/group/mute'),
  tagall:     () => require('./commands/group/tagall'),
  everyone:   () => require('./commands/group/tagall'),
  tag:        () => require('./commands/group/tagall'),
  groupinfo:  () => require('./commands/group/groupinfo'),
  promote:    () => require('./commands/group/promote'),
  demote:     () => require('./commands/group/demote'),
  setwelcome: () => require('./commands/group/setwelcome'),
  rules:      () => require('./commands/group/rules'),
  setrules:   () => require('./commands/group/rules'),
  warn:       () => require('./commands/group/warn'),
  warnings:   () => require('./commands/group/warn'),
  resetwarn:  () => require('./commands/group/warn'),

  // ── Owner Commands ──────────────────────────────────────────────────────────
  pair:       () => require('./commands/owner/pair'),
  broadcast:  () => require('./commands/owner/broadcast'),
  shutdown:   () => require('./commands/owner/shutdown'),
  setname:    () => require('./commands/owner/setname'),
  botstats:   () => require('./commands/owner/botstats'),
  ban:        () => require('./commands/owner/ban'),
  unban:      () => require('./commands/owner/ban'),
  addpremium: () => require('./commands/owner/premium'),
  rmpremium:  () => require('./commands/owner/premium'),
  buyprem:    () => require('./commands/owner/premium'),

  // ── Search ──────────────────────────────────────────────────────────────────
  gif:        () => require('./commands/search/gif'),
  lyrics:     () => require('./commands/search/lyrics'),
  movie:      () => require('./commands/search/movie'),
  news:       () => require('./commands/search/news'),
  wiki:       () => require('./commands/search/wiki'),
  ytsearch:   () => require('./commands/search/ytsearch'),
};

// ── Extract text from message ────────────────────────────────────────────────
function extractText(msg) {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    ''
  ).trim();
}

// ── Main handler ─────────────────────────────────────────────────────────────
module.exports = async function handleMessage(sock, msg, bot) {
  const jid    = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const text   = extractText(msg);
  const isGroup = jid.endsWith('@g.us');

  // Skip if banned
  if (db.isBanned(sender)) return;

  // Cache message for anti-delete
  cacheMessage(jid, msg.key.id, { text, sender, timestamp: Date.now() });

  // Auto-read
  if (config.autoRead) {
    await antiban.readWithJitter(sock, [msg.key]);
  }

  // Auto-react
  if (config.autoReact && text) {
    await autoFeatures.maybeReact(sock, msg, text);
  }

  // ── Keyword auto-replies ─────────────────────────────────────────────────
  if (text && !text.startsWith(config.prefix)) {
    const lower = text.toLowerCase();
    for (const kw of config.autoReplyKeywords) {
      if (lower.includes(kw.keyword)) {
        await antiban.sendHuman(sock, jid, { text: kw.reply }, { quoted: msg });
        return;
      }
    }
  }

  // ── Anti-link check (groups) ────────────────────────────────────────────────
  if (isGroup && detectLink(text)) {
    const handled = await antilinkMod.check(sock, msg, jid, sender, text);
    if (handled) return;
  }

  // ── Anti-word check (groups) ────────────────────────────────────────────────
  if (isGroup) {
    const handled = await antiwordMod.check(sock, msg, jid, sender, text);
    if (handled) return;
  }

  // ── Command parsing ─────────────────────────────────────────────────────────
  if (!text.startsWith(config.prefix)) return;

  const [cmdName, ...args] = text.slice(config.prefix.length).trim().split(/\s+/);
  const cmd = cmdName.toLowerCase();

  if (!COMMANDS[cmd]) return;

  // Check if owner-only
  const isOwner = config.ownerNumber.includes(sender.split('@')[0].split(':')[0]);

  // Increment stats
  db.incrementStat('totalCommands');
  db.incrementUserStat(sender, 'commands');

  try {
    const handler = COMMANDS[cmd]();
    await handler(sock, msg, args, { isOwner, sender, jid, isGroup, config, db });
  } catch (e) {
    console.error(`[CMD Error] ${cmd}:`, e.message);
    await antiban.sendHuman(sock, jid, {
      text: `❌ *Error executing ${config.prefix}${cmd}*\n\n_${e.message}_`,
    }, { quoted: msg });
  }
};
