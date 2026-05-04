/**
 * 🐛 Tech God Bug 2026 — Text to Speech
 * By Dev-Ntando
 */
'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');
const { fetchBuffer } = require('../../utils/api');

module.exports = async (sock, msg, args, { jid }) => {
  const text = args.join(' ').trim();
  if (!text) {
    return antiban.sendHuman(sock, jid, { text: `🎙️ *Usage:* ${config.prefix}tts <text>` }, { quoted: msg });
  }

  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
    const buffer = await fetchBuffer(url);
    await sock.sendMessage(jid, { audio: buffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ TTS failed. Try a shorter text.' }, { quoted: msg });
  }
};
