/**
 * 🐛 Tech God Bug 2026 — WA Protect
 * Runtime toggle for WhatsApp protection features.
 * By Dev-Ntando
 */
'use strict';

const db = require('../database');

function isEnabled() {
  const settings = db.getSettings();
  return settings.waProtect || false;
}

function enable() { db.setSetting('waProtect', true); }
function disable() { db.setSetting('waProtect', false); }

module.exports = { isEnabled, enable, disable };
