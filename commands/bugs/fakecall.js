/**
 * 🐛 Tech God Bug 2026 — Fake Call Bug
 * Sends fake call notification messages.
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!config.bugsEnabled.fake_call) {
    return antiban.sendHuman(sock, jid, { text: '❌ Fake call bug is currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Fake Call Bug*\n\n*Usage:* ${config.prefix}fakecall @user\n*Example:* ${config.prefix}fakecall @someone\n\n_Sends fake incoming/missed call messages._`,
    }, { quoted: msg });
  }

  await sock.sendMessage(target, { text: '📞 *Incoming call from TECH GOD...*' });
  await new Promise(r => setTimeout(r, 2000));
  await sock.sendMessage(target, { text: '🔴 *Missed call from +0 TECH GOD*\n⏰ Duration: 0:00' });
  await new Promise(r => setTimeout(r, 500));
  await sock.sendMessage(target, { text: '📞 *Incoming video call from TECH GOD...*' });

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, { text: `✅ *Fake call sent!*\n📞 Delivered to @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });
};
