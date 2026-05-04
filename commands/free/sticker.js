/**
 * 🐛 Tech God Bug 2026 — Sticker Command
 * Converts images to WhatsApp stickers.
 * By Dev-Ntando
 */
'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');
const { downloadMediaMessage } = require('baileys');

module.exports = async (sock, msg, args, { jid }) => {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const hasImage = msg.message?.imageMessage || quoted?.imageMessage;

  if (!hasImage) {
    return antiban.sendHuman(sock, jid, {
      text: `🖼️ *Sticker*\n\n*Usage:* Send or reply to an image with *${config.prefix}sticker*\n\n_Converts the image to a WhatsApp sticker._`,
    }, { quoted: msg });
  }

  try {
    const buffer = await downloadMediaMessage(
      quoted?.imageMessage ? { ...msg, message: { imageMessage: quoted.imageMessage } } : msg,
      'buffer', {}
    );

    await sock.sendMessage(jid, {
      sticker: buffer,
      mimetype: 'image/webp',
      stickerAuthor: config.botName,
      stickerName: '🐛 Tech God',
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed to create sticker: ${e.message}` }, { quoted: msg });
  }
};
