'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');
const db      = require('../../database');
module.exports = async (sock, msg, args, { jid, isGroup }) => {
  if (!isGroup) return antiban.sendHuman(sock, jid, { text: '❌ Groups only.' }, { quoted: msg });
  const cmd = (msg.message?.conversation || '').split(' ')[0]?.slice(1) || 'rules';
  if (cmd === 'setrules') {
    const text = args.join(' ').trim();
    if (!text) return antiban.sendHuman(sock, jid, { text: `*Usage:* ${config.prefix}setrules <rules text>` }, { quoted: msg });
    db.setGroup(jid, { rules: text });
    await antiban.sendHuman(sock, jid, { text: '✅ Group rules set!' }, { quoted: msg });
  } else {
    const group = db.getGroup(jid);
    const rules = group.rules || 'No rules set. Use .setrules to set them.';
    await antiban.sendHuman(sock, jid, { text: `📜 *Group Rules*\n\n${rules}` }, { quoted: msg });
  }
};
