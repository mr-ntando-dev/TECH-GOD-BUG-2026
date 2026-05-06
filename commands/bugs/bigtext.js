/**
 * 🐛 Tech God Bug 2026 — Big Text Bug
 * Sends massive repeated text blocks to fill the target's screen.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

function buildBigBlock(text, repeat = 300) {
  return (text + ' ').repeat(repeat).trim();
}

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `📢 *Big Text Bug*\n\n*Usage:* ${config.prefix}bigtext @user [your text]\n*Example:* ${config.prefix}bigtext @someone YOU GOT PRANKED\n\n_Sends a massive wall of text to overflow their screen._`,
    }, { quoted: msg });
  }

  // Remove the mention/number from args to get the actual text
  const textArgs = args.filter(a => !a.startsWith('@') && !/^\d+$/.test(a));
  const customText = textArgs.join(' ').trim() || '🐛 TECH GOD BUG 2026 🐛';

  const rounds = 3;
  await antiban.sendHuman(sock, jid, {
    text: `📢 *Sending big text...*\n🎯 Target: @${target.split('@')[0]}`,
    mentions: [target],
  }, { quoted: msg });

  for (let i = 0; i < rounds; i++) {
    await sock.sendMessage(target, { text: buildBigBlock(customText, 200) });
    await new Promise(r => setTimeout(r, 400));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Big text sent to @${target.split('@')[0]}!*`,
    mentions: [target],
  }, { quoted: msg });
};
