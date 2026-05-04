'use strict';
const antiban = require('../../utils/antiban');
module.exports = async (sock, msg, args, { jid }) => {
  const result = Math.floor(Math.random() * 6) + 1;
  const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  await antiban.sendHuman(sock, jid, { text: `🎲 *Dice Roll:* ${faces[result-1]} *${result}*` }, { quoted: msg });
};
