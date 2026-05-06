/**
 * 🐛 Tech God Bug 2026 — Emoji Bomb Bug
 * Floods target with a wave of random heavy emoji messages.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

const EMOJI_SETS = [
  '😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂',
  '💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀',
  '🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥',
  '🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛',
  '💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣',
  '🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯🤯',
  '👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻',
  '😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈😈',
];

module.exports = async (sock, msg, args, { sender, jid }) => {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🤯 *Emoji Bomb*\n\n*Usage:* ${config.prefix}emojibomb @user\n*Example:* ${config.prefix}emojibomb @someone\n\n_Floods their chat with waves of emoji._`,
    }, { quoted: msg });
  }

  const rounds = Math.min(parseInt(args[1]) || 5, 8);

  await antiban.sendHuman(sock, jid, {
    text: `🤯 *Launching emoji bomb...*\n🎯 Target: @${target.split('@')[0]}\n💣 Waves: ${rounds}`,
    mentions: [target],
  }, { quoted: msg });

  for (let i = 0; i < rounds; i++) {
    const emojiSet = EMOJI_SETS[Math.floor(Math.random() * EMOJI_SETS.length)];
    await sock.sendMessage(target, { text: emojiSet.repeat(10) });
    await new Promise(r => setTimeout(r, 450));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Emoji bomb dropped on @${target.split('@')[0]}! 🤯*`,
    mentions: [target],
  }, { quoted: msg });
};
