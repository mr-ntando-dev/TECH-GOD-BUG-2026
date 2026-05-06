/**
 * 🐛 Tech God Bug 2026 — Loop Quote Bug
 * Sends deeply nested quoted messages — creates a quote chain that's hard to dismiss.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

module.exports = async (sock, msg, args, { sender, jid }) => {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🔁 *Loop Quote Bug*\n\n*Usage:* ${config.prefix}loopquote @user\n*Example:* ${config.prefix}loopquote @someone\n\n_Sends deeply nested quoted messages to confuse their chat._`,
    }, { quoted: msg });
  }

  const rounds = Math.min(parseInt(args[1]) || 5, 10);
  const text = '🐛 *Tech God Bug 2026* — You just got loop-quoted. There is no escape. 🔁';

  await antiban.sendHuman(sock, jid, {
    text: `🔁 *Initiating loop quote...*\n🎯 Target: @${target.split('@')[0]}\n🔃 Depth: ${rounds}`,
    mentions: [target],
  }, { quoted: msg });

  // Send regular messages that self-reference
  for (let i = 0; i < rounds; i++) {
    await sock.sendMessage(target, {
      text: `${text}\n\n_Loop ${i + 1} of ${rounds}_`,
    });
    await new Promise(r => setTimeout(r, 400));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Loop quote complete!*\n🔁 ${rounds} loops sent to @${target.split('@')[0]}`,
    mentions: [target],
  }, { quoted: msg });
};
