'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');
const db      = require('../../database');
module.exports = async (sock, msg, args, { jid, isGroup }) => {
  if (!isGroup) return antiban.sendHuman(sock, jid, { text: '❌ Groups only.' }, { quoted: msg });
  const text = args.join(' ').trim();
  if (!text) return antiban.sendHuman(sock, jid, { text: `*Usage:* ${config.prefix}setwelcome <message>\n_Use @user as placeholder._` }, { quoted: msg });
  db.setGroup(jid, { welcome: text });
  await antiban.sendHuman(sock, jid, { text: `✅ Welcome message set!\n\n_Preview:_ ${text.replace(/@user/g, '@you')}` }, { quoted: msg });
};
