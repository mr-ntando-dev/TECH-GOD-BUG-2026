'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');
const db      = require('../../database');

async function check(sock, msg, jid, sender, text) {
  const group = db.getGroup(jid);
  if (!group.antiword || !group.antiword.length) return false;
  const lower = text.toLowerCase();
  for (const word of group.antiword) {
    if (lower.includes(word.toLowerCase())) {
      await sock.sendMessage(jid, { delete: msg.key });
      await antiban.sendHuman(sock, jid, { text: `⚠️ @${sender.split('@')[0]}, that word is not allowed here!`, mentions: [sender] });
      return true;
    }
  }
  return false;
}

async function handler(sock, msg, args, { jid, isGroup }) {
  if (!isGroup) return antiban.sendHuman(sock, jid, { text: '❌ Groups only.' }, { quoted: msg });
  const action = (args[0] || '').toLowerCase();
  const word = args.slice(1).join(' ').trim();

  if (action === 'add' && word) {
    const group = db.getGroup(jid);
    group.antiword = group.antiword || [];
    group.antiword.push(word);
    db.setGroup(jid, group);
    await antiban.sendHuman(sock, jid, { text: `🚫 Added "${word}" to blocked words.` }, { quoted: msg });
  } else if (action === 'remove' && word) {
    const group = db.getGroup(jid);
    group.antiword = (group.antiword || []).filter(w => w.toLowerCase() !== word.toLowerCase());
    db.setGroup(jid, group);
    await antiban.sendHuman(sock, jid, { text: `✅ Removed "${word}" from blocked words.` }, { quoted: msg });
  } else if (action === 'list') {
    const group = db.getGroup(jid);
    const list = (group.antiword || []).join(', ') || 'None';
    await antiban.sendHuman(sock, jid, { text: `🚫 *Blocked Words:*\n${list}` }, { quoted: msg });
  } else {
    await antiban.sendHuman(sock, jid, { text: `🚫 *Anti-Word*\n\n${config.prefix}antiword add <word>\n${config.prefix}antiword remove <word>\n${config.prefix}antiword list` }, { quoted: msg });
  }
}

handler.check = check;
module.exports = handler;
