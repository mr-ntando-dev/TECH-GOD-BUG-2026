'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');
const db      = require('../../database');

async function handleGroupUpdate(sock, update) {
  const { id, participants, action } = update;
  const group = db.getGroup(id);

  if (action === 'add' && group.welcome) {
    for (const p of participants) {
      const text = group.welcome.replace(/@user/g, `@${p.split('@')[0]}`);
      await antiban.sendHuman(sock, id, { text, mentions: [p] });
    }
  }
  if (action === 'remove' && group.goodbye) {
    for (const p of participants) {
      const text = group.goodbye.replace(/@user/g, `@${p.split('@')[0]}`);
      await antiban.sendHuman(sock, id, { text, mentions: [p] });
    }
  }
}

async function handler(sock, msg, args, { jid, isGroup }) {
  if (!isGroup) return antiban.sendHuman(sock, jid, { text: '❌ Groups only.' }, { quoted: msg });
  const action = (args[0] || '').toLowerCase();
  if (action === 'on') {
    db.setGroup(jid, { welcome: '👋 Welcome to the group, @user! 🐛' });
    await antiban.sendHuman(sock, jid, { text: '✅ Welcome messages enabled!' }, { quoted: msg });
  } else if (action === 'off') {
    db.setGroup(jid, { welcome: '' });
    await antiban.sendHuman(sock, jid, { text: '✅ Welcome messages disabled.' }, { quoted: msg });
  } else {
    await antiban.sendHuman(sock, jid, { text: `👋 *Welcome*\n\n${config.prefix}welcome on/off` }, { quoted: msg });
  }
}

handler.handleGroupUpdate = handleGroupUpdate;
module.exports = handler;
