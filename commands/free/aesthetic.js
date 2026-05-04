'use strict';
const antiban = require('../../utils/antiban');
const config = require('../../config');
module.exports = async (sock, msg, args, { jid }) => {
  const text = args.join(' ').trim();
  if (!text) return antiban.sendHuman(sock, jid, { text: `✨ *Usage:* ${config.prefix}aesthetic <text>` }, { quoted: msg });
  const aesthetic = text.split('').map(c => c === ' ' ? '  ' : String.fromCharCode(0xFEE0 + c.charCodeAt(0))).join(' ');
  await antiban.sendHuman(sock, jid, { text: `✨ ${aesthetic}` }, { quoted: msg });
};
