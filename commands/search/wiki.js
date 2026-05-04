'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const query = args.join(' ').trim();
  if (!query) return antiban.sendHuman(sock, jid, { text: `📖 *Usage:* ${config.prefix}wiki <query>` }, { quoted: msg });
  try {
    const data = await fetchJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    const text = data.extract || 'No Wikipedia article found.';
    const title = data.title || query;
    await antiban.sendHuman(sock, jid, { text: `📖 *${title}*\n\n${text}\n\n_🐛 Tech God Bug 2026_` }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ Wikipedia search failed.' }, { quoted: msg });
  }
};
