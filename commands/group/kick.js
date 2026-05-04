'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid, isGroup, isOwner }) => {
  if (!isGroup) return antiban.sendHuman(sock, jid, { text: '❌ Groups only.' }, { quoted: msg });
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  if (!mentioned.length) return antiban.sendHuman(sock, jid, { text: `👢 *Usage:* ${config.prefix}kick @user` }, { quoted: msg });
  try {
    await sock.groupParticipantsUpdate(jid, mentioned, 'remove');
    await antiban.sendHuman(sock, jid, { text: `👢 Kicked @${mentioned[0].split('@')[0]}`, mentions: mentioned }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed: ${e.message}` }, { quoted: msg });
  }
};
