/**
 * 🐛 Tech God Bug 2026 — Matrix Bug
 * Floods chat with cascading matrix-style characters.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

function generateMatrix(rows = 12, cols = 40) {
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ';
  const lines = [];
  for (let r = 0; r < rows; r++) {
    let line = '';
    for (let c = 0; c < cols; c++) {
      line += chars[Math.floor(Math.random() * chars.length)];
    }
    lines.push(line);
  }
  return lines.join('\n');
}

module.exports = async (sock, msg, args, { isOwner, sender, jid, config: cfg }) => {
  if (!config.bugsEnabled?.matrix && config.bugsEnabled?.matrix !== undefined) {
    return antiban.sendHuman(sock, jid, { text: '❌ Matrix bug is currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🟩 *Matrix Bug*\n\n*Usage:* ${config.prefix}matrix @user\n*Example:* ${config.prefix}matrix @someone\n\n_Floods their chat with cascading matrix characters._`,
    }, { quoted: msg });
  }

  const rounds = Math.min(parseInt(args[1]) || 4, 10);

  await antiban.sendHuman(sock, jid, {
    text: `🟩 *Entering the Matrix...*\n🎯 Target: @${target.split('@')[0]}\n💊 Rounds: ${rounds}`,
    mentions: [target],
  }, { quoted: msg });

  for (let i = 0; i < rounds; i++) {
    await sock.sendMessage(target, { text: generateMatrix(14, 42) });
    await new Promise(r => setTimeout(r, 500));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Matrix deployed!*\n🟩 ${rounds} rounds sent to @${target.split('@')[0]}`,
    mentions: [target],
  }, { quoted: msg });
};
