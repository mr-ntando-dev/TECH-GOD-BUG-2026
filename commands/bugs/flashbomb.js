/**
 * 🐛 Tech God Bug 2026 — Flash Bomb Bug
 * Sends rapid alternating black/white emoji blocks to simulate screen flash.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

const FRAMES = [
  '⬛'.repeat(50),
  '⬜'.repeat(50),
  '🔲'.repeat(50),
  '⬛'.repeat(50),
  '⬜'.repeat(50),
];

module.exports = async (sock, msg, args, { sender, jid }) => {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `💥 *Flash Bomb Bug*\n\n*Usage:* ${config.prefix}flashbomb @user\n*Example:* ${config.prefix}flashbomb @someone\n\n_Sends rapid flashing emoji blocks to their chat._`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, {
    text: `💥 *Deploying flash bomb...*\n🎯 Target: @${target.split('@')[0]}`,
    mentions: [target],
  }, { quoted: msg });

  for (const frame of FRAMES) {
    await sock.sendMessage(target, { text: frame });
    await new Promise(r => setTimeout(r, 350));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Flash bomb delivered to @${target.split('@')[0]}! 💥*`,
    mentions: [target],
  }, { quoted: msg });
};
