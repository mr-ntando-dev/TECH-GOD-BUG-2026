/**
 * 🐛 Tech God Bug 2026 — Define Command (Dictionary)
 * By Dev-Ntando
 */
'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const word = args.join(' ').trim();
  if (!word) {
    return antiban.sendHuman(sock, jid, { text: `📖 *Usage:* ${config.prefix}define <word>` }, { quoted: msg });
  }

  try {
    const data = await fetchJson(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    const entry = data[0];
    const meaning = entry?.meanings?.[0];
    const def = meaning?.definitions?.[0]?.definition || 'No definition found.';
    const example = meaning?.definitions?.[0]?.example;
    const partOfSpeech = meaning?.partOfSpeech || '';

    let text = `📖 *${entry.word}*${partOfSpeech ? ` _(${partOfSpeech})_` : ''}\n\n📝 *Definition:* ${def}`;
    if (example) text += `\n💡 *Example:* _"${example}"_`;

    await antiban.sendHuman(sock, jid, { text }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: `❌ Could not find definition for "${word}".` }, { quoted: msg });
  }
};
