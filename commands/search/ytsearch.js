'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const query = args.join(' ').trim();
  if (!query) return antiban.sendHuman(sock, jid, { text: `🔍 *Usage:* ${config.prefix}ytsearch <query>` }, { quoted: msg });
  try {
    const data = await fetchJson(`https://api.dreaded.site/api/ytsearch?q=${encodeURIComponent(query)}`);
    const results = data.result || data.results || [];
    if (!results.length) throw new Error('No results');
    const text = results.slice(0, 5).map((r, i) => `${i+1}. *${r.title}*\n   🔗 ${r.url || r.link}\n   ⏱️ ${r.duration || ''}`).join('\n\n');
    await antiban.sendHuman(sock, jid, { text: `🔍 *YouTube Search: ${query}*\n\n${text}\n\n_🐛 Tech God Bug 2026_` }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ YouTube search failed.' }, { quoted: msg });
  }
};
