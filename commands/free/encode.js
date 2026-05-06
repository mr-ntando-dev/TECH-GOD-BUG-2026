/**
 * 🐛 Tech God Bug 2026 — Encode / Decode Command
 * Base64 encode or decode any text.
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const mode = args[0]?.toLowerCase(); // 'encode' or 'decode'
  const text = args.slice(1).join(' ').trim();

  if (!mode || !text || !['encode', 'decode'].includes(mode)) {
    return antiban.sendHuman(sock, jid, {
      text: `🔐 *Encode / Decode*\n\n*Usage:*\n  ${config.prefix}encode encode <text>\n  ${config.prefix}encode decode <base64>\n\n*Example:*\n  ${config.prefix}encode encode Hello World\n  ${config.prefix}encode decode SGVsbG8gV29ybGQ=`,
    }, { quoted: msg });
  }

  try {
    let result;
    if (mode === 'encode') {
      result = Buffer.from(text, 'utf8').toString('base64');
      await antiban.sendHuman(sock, jid, {
        text: `🔐 *Base64 Encoded:*\n\n\`\`\`\n${result}\n\`\`\`\n\n_🐛 Tech God Bug 2026_`,
      }, { quoted: msg });
    } else {
      result = Buffer.from(text, 'base64').toString('utf8');
      await antiban.sendHuman(sock, jid, {
        text: `🔓 *Base64 Decoded:*\n\n\`\`\`\n${result}\n\`\`\`\n\n_🐛 Tech God Bug 2026_`,
      }, { quoted: msg });
    }
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ Invalid input for decoding.' }, { quoted: msg });
  }
};
