/**
 * 🐛 Tech God Bug 2026 — Freeze Bug
 * Sends a very long blank/newline message to push content off screen.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

function generateBlankMessage(lines = 4000) {
  return '\n'.repeat(lines) + '🐛 *TECH GOD BUG 2026*';
}

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!config.bugsEnabled.freeze) {
    return antiban.sendHuman(sock, jid, { text: '❌ Freeze bug is currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Freeze Bug*\n\n*Usage:* ${config.prefix}freeze @user\n*Example:* ${config.prefix}freeze @someone\n\n_Sends a long blank message to push their chat off screen._`,
    }, { quoted: msg });
  }

  const lines = Math.min(parseInt(args[1]) || 4000, 8000);

  await antiban.sendHuman(sock, jid, { text: `🐛 *Sending freeze bug...*\n🎯 Target: @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });

  await sock.sendMessage(target, { text: generateBlankMessage(lines) });

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, { text: `✅ *Freeze bug sent!*\n🐛 ${lines} lines delivered to @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });
};
