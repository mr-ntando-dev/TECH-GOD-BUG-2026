'use strict';
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid, isGroup }) => {
  if (!isGroup) return antiban.sendHuman(sock, jid, { text: '❌ Groups only.' }, { quoted: msg });
  try {
    const meta = await sock.groupMetadata(jid);
    const participants = meta.participants.map(p => p.id);
    const text = args.join(' ') || '📢 *Attention Everyone!*';
    const mentions = participants;
    const tagText = `${text}\n\n${participants.map(p => `@${p.split('@')[0]}`).join(' ')}`;
    await antiban.sendHuman(sock, jid, { text: tagText, mentions }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed: ${e.message}` }, { quoted: msg });
  }
};
