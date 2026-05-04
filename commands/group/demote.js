'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');
module.exports = async (sock, msg, args, { jid, isGroup }) => {
  if (!isGroup) return antiban.sendHuman(sock, jid, { text: '❌ Groups only.' }, { quoted: msg });
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  if (!mentioned.length) return antiban.sendHuman(sock, jid, { text: `*Usage:* ${config.prefix}demote @user` }, { quoted: msg });
  try {
    await sock.groupParticipantsUpdate(jid, mentioned, 'demote');
    await antiban.sendHuman(sock, jid, { text: `⬇️ Demoted @${mentioned[0].split('@')[0]}`, mentions: mentioned }, { quoted: msg });
  } catch (e) { await antiban.sendHuman(sock, jid, { text: `❌ ${e.message}` }, { quoted: msg }); }
};
