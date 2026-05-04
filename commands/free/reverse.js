'use strict';
const antiban = require('../../utils/antiban');
const config = require('../../config');
module.exports = async (sock, msg, args, { jid }) => {
  const text = args.join(' ').trim();
  if (!text) return antiban.sendHuman(sock, jid, { text: `🔄 *Usage:* ${config.prefix}reverse <text>` }, { quoted: msg });
  await antiban.sendHuman(sock, jid, { text: `🔄 *Reversed:*\n\n${text.split('').reverse().join('')}` }, { quoted: msg });
};
