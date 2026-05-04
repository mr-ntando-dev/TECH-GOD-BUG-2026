'use strict';
const antiban = require('../../utils/antiban');
const config = require('../../config');
module.exports = async (sock, msg, args, { jid }) => {
  const len = Math.min(Math.max(parseInt(args[0]) || 16, 8), 64);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let pw = '';
  for (let i = 0; i < len; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  await antiban.sendHuman(sock, jid, { text: `🔐 *Generated Password (${len} chars):*\n\n\`\`\`${pw}\`\`\`` }, { quoted: msg });
};
