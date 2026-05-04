'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const query = args.join(' ').trim();
  if (!query) return antiban.sendHuman(sock, jid, { text: `🎞️ *Usage:* ${config.prefix}gif <query>` }, { quoted: msg });
  try {
    const data = await fetchJson(`https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(query)}&api_key=dc6zaTOxFJmzC&limit=1`);
    const gif = data.data?.[0]?.images?.original?.url;
    if (!gif) throw new Error('No GIF found');
    await sock.sendMessage(jid, { video: { url: gif }, gifPlayback: true, caption: `🎞️ *${query}*` }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ GIF search failed.' }, { quoted: msg });
  }
};
