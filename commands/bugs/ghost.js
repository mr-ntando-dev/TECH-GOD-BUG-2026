/**
 * 🐛 Tech God Bug 2026 — Ghost Bug
 * Sends invisible zero-width text (appears as empty message).
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

function makeInvisible(text) {
  const zeroWidth = ['\u200b', '\u200c', '\u200d', '\ufeff'];
  let ghost = '';
  for (let i = 0; i < 500; i++) {
    ghost += zeroWidth[Math.floor(Math.random() * zeroWidth.length)];
  }
  return ghost;
}

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!config.bugsEnabled.ghost) {
    return antiban.sendHuman(sock, jid, { text: '❌ Ghost bug is currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Ghost Bug*\n\n*Usage:* ${config.prefix}ghost @user\n*Example:* ${config.prefix}ghost @someone\n\n_Sends an invisible empty message._`,
    }, { quoted: msg });
  }

  await sock.sendMessage(target, { text: makeInvisible() });

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, { text: `✅ *Ghost message sent!*\n👻 Invisible text delivered to @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });
};
