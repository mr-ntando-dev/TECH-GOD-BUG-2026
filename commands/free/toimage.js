'use strict';
const antiban = require('../../utils/antiban');
const config = require('../../config');
module.exports = async (sock, msg, args, { jid }) => {
  await antiban.sendHuman(sock, jid, { text: `🖼️ *To Image*\n\n_Reply to a sticker with ${config.prefix}toimage to convert it back to an image._` }, { quoted: msg });
};
