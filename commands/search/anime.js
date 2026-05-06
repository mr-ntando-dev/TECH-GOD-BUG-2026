/**
 * 🐛 Tech God Bug 2026 — Anime Search Command
 * Searches anime info via Jikan (MyAnimeList) public API.
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
      text: `🎌 *Anime Search*\n\n*Usage:* ${config.prefix}anime <anime title>\n*Example:* ${config.prefix}anime Naruto\n\n_Searches MyAnimeList for anime info._`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: `🎌 _Searching anime: "${query}"..._` }, { quoted: msg });

  try {
    const data = await fetchJson(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`,
    );

    const anime = data?.data?.[0];
    if (!anime) throw new Error(`No anime found for "${query}"`);

    const genres  = anime.genres?.map(g => g.name).join(', ') || 'N/A';
    const studios = anime.studios?.map(s => s.name).join(', ') || 'N/A';
    const synopsis = anime.synopsis
      ? anime.synopsis.substring(0, 300) + (anime.synopsis.length > 300 ? '...' : '')
      : 'N/A';

    await antiban.sendHuman(sock, jid, {
      text: [
        `🎌 *${anime.title}*`,
        anime.title_english && anime.title_english !== anime.title ? `  _(${anime.title_english})_` : '',
        ``,
        `⭐ *Score:* ${anime.score || 'N/A'} / 10`,
        `📺 *Type:* ${anime.type || 'N/A'}`,
        `🔢 *Episodes:* ${anime.episodes || '?'}`,
        `📅 *Status:* ${anime.status || 'N/A'}`,
        `🎭 *Genres:* ${genres}`,
        `🏢 *Studio:* ${studios}`,
        ``,
        `📖 *Synopsis:*`,
        synopsis,
        ``,
        `🔗 *MAL:* ${anime.url || 'N/A'}`,
        ``,
        `_🐛 Tech God Bug 2026 · ${config.botName}_`,
      ].filter(l => l !== '').join('\n'),
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, {
      text: `❌ ${e.message}\n_Try: ${config.prefix}anime Attack on Titan_`,
    }, { quoted: msg });
  }
};
