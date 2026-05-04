/**
 * 🐛 Tech God Bug 2026 v1.0.0 — Lightweight JSON Database
 * Flat-file storage with atomic writes.
 * Tracks: group settings, user data, premium users, daily limits, bug stats.
 * By Dev-Ntando
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const DB_PATH  = path.join(__dirname, 'database');
const FILES    = {
  groups:   path.join(DB_PATH, 'groups.json'),
  users:    path.join(DB_PATH, 'users.json'),
  premium:  path.join(DB_PATH, 'premium.json'),
  limits:   path.join(DB_PATH, 'limits.json'),
  settings: path.join(DB_PATH, 'settings.json'),
  stats:    path.join(DB_PATH, 'stats.json'),
  banned:   path.join(DB_PATH, 'banned.json'),
};

// ── Ensure database directory and files ───────────────────────────────────────
if (!fs.existsSync(DB_PATH)) fs.mkdirSync(DB_PATH, { recursive: true });

function _init(file, defaultVal) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2));
}

_init(FILES.groups,   {});
_init(FILES.users,    {});
_init(FILES.premium,  {});
_init(FILES.limits,   {});
_init(FILES.settings, { waProtect: false, autoRead: true, autoTyping: true, autoReact: true });
_init(FILES.stats,    { startTime: Date.now(), totalCommands: 0, totalBugs: 0 });
_init(FILES.banned,   {});

// ── Read / Write helpers ─────────────────────────────────────────────────────
function _read(file)       { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return {}; } }
function _write(file, obj) { fs.writeFileSync(file, JSON.stringify(obj, null, 2)); }

// ── Group settings ───────────────────────────────────────────────────────────
function getGroup(jid) {
  const db = _read(FILES.groups);
  if (!db[jid]) db[jid] = { antilink: false, antiword: [], welcome: '', goodbye: '', rules: '', warnings: {} };
  return db[jid];
}

function setGroup(jid, data) {
  const db = _read(FILES.groups);
  db[jid] = { ...getGroup(jid), ...data };
  _write(FILES.groups, db);
}

// ── User data ────────────────────────────────────────────────────────────────
function getUser(jid) {
  const db = _read(FILES.users);
  if (!db[jid]) db[jid] = { commands: 0, bugs: 0, joined: Date.now() };
  return db[jid];
}

function setUser(jid, data) {
  const db = _read(FILES.users);
  db[jid] = { ...getUser(jid), ...data };
  _write(FILES.users, db);
}

function incrementUserStat(jid, field) {
  const user = getUser(jid);
  user[field] = (user[field] || 0) + 1;
  setUser(jid, user);
}

// ── Premium ──────────────────────────────────────────────────────────────────
function isPremium(jid) {
  const db = _read(FILES.premium);
  if (!db[jid]) return false;
  if (db[jid].expires && db[jid].expires < Date.now()) {
    delete db[jid];
    _write(FILES.premium, db);
    return false;
  }
  return true;
}

function addPremium(jid, days = 30) {
  const db = _read(FILES.premium);
  db[jid] = { since: Date.now(), expires: Date.now() + days * 86400000 };
  _write(FILES.premium, db);
}

function removePremium(jid) {
  const db = _read(FILES.premium);
  delete db[jid];
  _write(FILES.premium, db);
}

// ── Daily limits ─────────────────────────────────────────────────────────────
function getDailyUsage(jid, type) {
  const db = _read(FILES.limits);
  const today = new Date().toISOString().slice(0, 10);
  if (!db[jid] || db[jid].date !== today) {
    db[jid] = { date: today, play: 0, video: 0, tiktok: 0 };
    _write(FILES.limits, db);
  }
  return db[jid][type] || 0;
}

function incrementDailyUsage(jid, type) {
  const db = _read(FILES.limits);
  const today = new Date().toISOString().slice(0, 10);
  if (!db[jid] || db[jid].date !== today) db[jid] = { date: today, play: 0, video: 0, tiktok: 0 };
  db[jid][type] = (db[jid][type] || 0) + 1;
  _write(FILES.limits, db);
}

// ── Stats ────────────────────────────────────────────────────────────────────
function getStats() { return _read(FILES.stats); }

function incrementStat(field) {
  const stats = getStats();
  stats[field] = (stats[field] || 0) + 1;
  _write(FILES.stats, stats);
}

// ── Banned users ─────────────────────────────────────────────────────────────
function isBanned(jid) { return !!_read(FILES.banned)[jid]; }
function ban(jid)      { const db = _read(FILES.banned); db[jid] = Date.now(); _write(FILES.banned, db); }
function unban(jid)    { const db = _read(FILES.banned); delete db[jid]; _write(FILES.banned, db); }

// ── Settings ─────────────────────────────────────────────────────────────────
function getSettings() { return _read(FILES.settings); }
function setSetting(key, val) {
  const s = getSettings();
  s[key] = val;
  _write(FILES.settings, s);
}

module.exports = {
  getGroup, setGroup,
  getUser, setUser, incrementUserStat,
  isPremium, addPremium, removePremium,
  getDailyUsage, incrementDailyUsage,
  getStats, incrementStat,
  isBanned, ban, unban,
  getSettings, setSetting,
};
