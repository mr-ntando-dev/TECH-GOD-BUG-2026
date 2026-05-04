/**
 * 🐛 Tech God Bug 2026 — Translate Command
 * By Dev-Ntando
 */
'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  if (args.length < 2) {
    return antiban.sendHuman(sock, jid, {
      text: `🌐 *Translate*\n\n*Usage:* ${config.prefix}tr <lang> <text>\n*Example:* ${config.prefix}tr es Hello world\n\n_Supported: en, es, fr, de, zh, ja, pt, ar, sw, etc._`,
    }, { quoted: msg });
  }

  const lang = args[0].toLowerCase();
  const text = args.slice(1).join(' ');

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`;
    const data = await fetchJson(url);
    const translated = data?.responseData?.translatedText || 'Translation failed.';

    await antiban.sendHuman(sock, jid, {
      text: `🌐 *Translation*\n\n📝 *Original:* ${text}\n🔄 *Translated (${lang}):* ${translated}\n\n_🐛 Tech God Bug 2026_`,
    }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ Translation failed. Try again.' }, { quoted: msg });
  }
};
