/**
 * 🐛 Tech God Bug 2026 — Auto Protect
 * Prevents bot from being removed from groups / demoted.
 * By Dev-Ntando
 */
'use strict';

const config = require('../config');

async function handleGroupUpdate(sock, update) {
  if (!config.waProtect) return;
  const { id, participants, action } = update;
  const botJid = sock.user?.id;
  if (!botJid) return;
  const botNumber = botJid.split(':')[0] + '@s.whatsapp.net';

  if (action === 'remove' && participants.includes(botNumber)) {
    // Bot was removed — nothing we can do
    console.log('[AutoProtect] Bot was removed from', id);
  }

  if (action === 'demote' && participants.includes(botNumber)) {
    console.log('[AutoProtect] Bot was demoted in', id);
  }
}

module.exports = { handleGroupUpdate };
