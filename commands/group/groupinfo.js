'use strict';
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid, isGroup }) => {
  if (!isGroup) return antiban.sendHuman(sock, jid, { text: '❌ Groups only.' }, { quoted: msg });
  try {
    const meta = await sock.groupMetadata(jid);
    const admins = meta.participants.filter(p => p.admin).length;
    const text = [
      `👥 *Group Info*\n`,
      `📛 *Name:* ${meta.subject}`,
      `👤 *Owner:* @${(meta.owner || '').split('@')[0]}`,
      `👥 *Members:* ${meta.participants.length}`,
      `👑 *Admins:* ${admins}`,
      `📝 *Description:* ${meta.desc || 'None'}`,
      `\n_🐛 Tech God Bug 2026_`,
    ].join('\n');
    await antiban.sendHuman(sock, jid, { text, mentions: [meta.owner] }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed: ${e.message}` }, { quoted: msg });
  }
};
