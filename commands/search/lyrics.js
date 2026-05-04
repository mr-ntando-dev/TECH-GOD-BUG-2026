'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const query = args.join(' ').trim();
  if (!query) return antiban.sendHuman(sock, jid, { text: `🎵 *Usage:* ${config.prefix}lyrics <song name>` }, { quoted: msg });
  try {
    const data = await fetchJson(`https://api.dreaded.site/api/lyrics?q=${encodeURIComponent(query)}`);
    const lyrics = data.result?.lyrics || data.lyrics || 'Lyrics not found.';
    const title = data.result?.title || query;
    const artist = data.result?.artist || '';
    const text = `🎵 *${title}*${artist ? ` — ${artist}` : ''}\n\n${lyrics.slice(0, 3000)}\n\n_🐛 Tech God Bug 2026_`;
    await antiban.sendHuman(sock, jid, { text }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ Lyrics search failed.' }, { quoted: msg });
  }
};
