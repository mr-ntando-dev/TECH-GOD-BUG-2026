/**
 * 🐛 Tech God Bug 2026 — QR Code Generator
 * By Dev-Ntando
 */
'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const text = args.join(' ').trim();
  if (!text) {
    return antiban.sendHuman(sock, jid, { text: `📱 *Usage:* ${config.prefix}qr <text or url>` }, { quoted: msg });
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;

  await antiban.sendHuman(sock, jid, {
    image: { url: qrUrl },
    caption: `📱 *QR Code Generated*\n\n📝 Content: ${text}\n\n_🐛 Tech God Bug 2026_`,
  }, { quoted: msg });
};
