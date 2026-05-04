'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const query = args.join(' ').trim();
  if (!query) return antiban.sendHuman(sock, jid, { text: `🎬 *Usage:* ${config.prefix}movie <name>` }, { quoted: msg });
  try {
    const data = await fetchJson(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=9ea9f498`);
    if (data.Response === 'False') throw new Error(data.Error);
    const text = [
      `🎬 *${data.Title}* (${data.Year})`, '',
      `⭐ *Rating:* ${data.imdbRating}/10`,
      `🎭 *Genre:* ${data.Genre}`,
      `🎬 *Director:* ${data.Director}`,
      `🎭 *Cast:* ${data.Actors}`,
      `⏱️ *Runtime:* ${data.Runtime}`,
      '', `📝 *Plot:* ${data.Plot}`,
      '', `_🐛 Tech God Bug 2026_`,
    ].join('\n');
    if (data.Poster && data.Poster !== 'N/A') {
      await antiban.sendHuman(sock, jid, { image: { url: data.Poster }, caption: text }, { quoted: msg });
    } else {
      await antiban.sendHuman(sock, jid, { text }, { quoted: msg });
    }
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Movie not found: ${e.message}` }, { quoted: msg });
  }
};
