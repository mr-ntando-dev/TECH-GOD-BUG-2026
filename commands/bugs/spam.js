/**
 * 🐛 Tech God Bug 2026 — Spam Bug
 * Sends a repeated message N times.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!config.bugsEnabled.spam) {
    return antiban.sendHuman(sock, jid, { text: '❌ Spam bug is currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Spam Bug*\n\n*Usage:* ${config.prefix}spam @user [count] [text]\n*Example:* ${config.prefix}spam @someone 20 💥\n\n_Sends repeated messages._`,
    }, { quoted: msg });
  }

  const count = Math.min(parseInt(args[1]) || 20, 50);
  const text  = args.slice(2).join(' ') || '💥 TECH GOD BUG 2026 💥';

  await antiban.sendHuman(sock, jid, { text: `🐛 *Sending spam...*\n🎯 Target: @${target.split('@')[0]}\n📨 Count: ${count}`, mentions: [target] }, { quoted: msg });

  for (let i = 0; i < count; i++) {
    await sock.sendMessage(target, { text });
    await new Promise(r => setTimeout(r, 300));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, { text: `✅ *Spam done!*\n🐛 ${count}x messages sent to @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });
};
