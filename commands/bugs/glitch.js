/**
 * 🐛 Tech God Bug 2026 — Glitch Bug
 * Sends zalgo/glitched text messages that look corrupted on screen.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

// Combining diacritical marks for zalgo effect
const ZALGO_UP = ['\u0300','\u0301','\u0302','\u0303','\u0304','\u0305','\u0306','\u0307','\u0308','\u0309','\u030A','\u030B','\u030C','\u030D','\u030E','\u030F','\u0310','\u0311','\u0312','\u0313'];
const ZALGO_MID = ['\u0334','\u0335','\u0336','\u0337','\u0338'];
const ZALGO_DOWN = ['\u0316','\u0317','\u0318','\u0319','\u031A','\u031B','\u031C','\u031D','\u031E','\u031F','\u0320','\u0321','\u0322','\u0323','\u0324','\u0325','\u0326','\u0327','\u0328','\u0329'];

function zalgo(text, intensity = 8) {
  return text.split('').map(char => {
    let result = char;
    for (let i = 0; i < intensity; i++) {
      result += ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)];
      result += ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)];
      if (Math.random() > 0.5) result += ZALGO_MID[Math.floor(Math.random() * ZALGO_MID.length)];
    }
    return result;
  }).join('');
}

const MESSAGES = [
  'TECH GOD BUG 2026',
  'YOUR PHONE IS HACKED',
  'SYSTEM ERROR DETECTED',
  'LOADING... PLEASE WAIT',
  'BUG HAS ENTERED THE CHAT',
];

module.exports = async (sock, msg, args, { sender, jid }) => {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `👾 *Glitch Bug*\n\n*Usage:* ${config.prefix}glitch @user\n*Example:* ${config.prefix}glitch @someone\n\n_Sends zalgo/glitched corrupted text to their chat._`,
    }, { quoted: msg });
  }

  const rounds = Math.min(parseInt(args[1]) || 4, 8);

  await antiban.sendHuman(sock, jid, {
    text: `👾 *Glitching their reality...*\n🎯 Target: @${target.split('@')[0]}`,
    mentions: [target],
  }, { quoted: msg });

  for (let i = 0; i < rounds; i++) {
    const base = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    await sock.sendMessage(target, { text: zalgo(base, 10) });
    await new Promise(r => setTimeout(r, 500));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Glitch bug sent to @${target.split('@')[0]}! 👾*`,
    mentions: [target],
  }, { quoted: msg });
};
