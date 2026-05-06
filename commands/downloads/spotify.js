/**
 * 🐛 Tech God Bug 2026 — Spotify Track Info + YouTube Search
 * Looks up a Spotify track and finds it on YouTube for download.
 * By Dev-Ntando
 */
'use strict';

const { fetchJson } = require('../../utils/api');
const config        = require('../../config');
const antiban       = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const query = args.join(' ').trim();

  if (!query) {
    return antiban.sendHuman(sock, jid, {
      text: `🎵 *Spotify Search*\n\n*Usage:* ${config.prefix}spotify <song name or artist>\n*Example:* ${config.prefix}spotify Burna Boy Last Last\n\n_Finds the track info and YouTube link for download._`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: '🎵 _Searching Spotify..._' }, { quoted: msg });

  try {
    // Using iTunes Search API as a free Spotify-like metadata source
    const data = await fetchJson(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`,
    );

    const track = data?.results?.[0];
    if (!track) throw new Error('No track found');

    const { trackName, artistName, collectionName, trackTimeMillis, artworkUrl100, trackViewUrl } = track;
    const duration = trackTimeMillis
      ? `${Math.floor(trackTimeMillis / 60000)}:${String(Math.floor((trackTimeMillis % 60000) / 1000)).padStart(2, '0')}`
      : 'Unknown';

    const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${trackName} ${artistName} official`)}`;

    await antiban.sendHuman(sock, jid, {
      text: [
        `🎵 *Track Found*`,
        ``,
        `🎤 *Artist:* ${artistName}`,
        `🎶 *Title:* ${trackName}`,
        `💿 *Album:* ${collectionName || 'N/A'}`,
        `⏱️ *Duration:* ${duration}`,
        ``,
        `📥 *To download, use:*`,
        `  ╰┈➤ ${config.prefix}song ${trackName} ${artistName}`,
        ``,
        `🔗 *YouTube Search:*`,
        `  ${ytSearch}`,
        ``,
        `_🐛 Tech God Bug 2026 · ${config.botName}_`,
      ].join('\n'),
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, {
      text: `❌ Could not find track: *${query}*\n\n_Try: ${config.prefix}song ${query}_`,
    }, { quoted: msg });
  }
};
