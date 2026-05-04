/**
 * 🐛 Tech God Bug 2026 — YouTube MP3 Downloader
 * By Dev-Ntando
 */
'use strict';
const { fetchJson, fetchBuffer } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');
const db      = require('../../database');

module.exports = async (sock, msg, args, { jid, sender }) => {
  const query = args.join(' ').trim();
  if (!query) {
    return antiban.sendHuman(sock, jid, { text: `🎵 *YouTube MP3*\n\n*Usage:* ${config.prefix}song <name or url>` }, { quoted: msg });
  }

  const isPrem = db.isPremium(sender);
  const limit = isPrem ? config.limits.premium.play : config.limits.free.play;
  const used = db.getDailyUsage(sender, 'play');
  if (used >= limit) {
    return antiban.sendHuman(sock, jid, { text: `❌ Daily song limit reached (${limit}/${limit}).\n💎 Upgrade to premium!` }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: '🎵 _Searching and downloading..._' }, { quoted: msg });

  try {
    const api = await fetchJson(`https://api.dreaded.site/api/ytmp3?url=${encodeURIComponent(query)}`);
    const audioUrl = api.result?.url || api.result?.download || api.url;
    const title = api.result?.title || query;
    if (!audioUrl) throw new Error('No audio found');

    const buffer = await fetchBuffer(audioUrl);
    await sock.sendMessage(jid, {
      audio: buffer, mimetype: 'audio/mpeg', ptt: false,
      fileName: `${title}.mp3`,
    }, { quoted: msg });
    db.incrementDailyUsage(sender, 'play');
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Song download failed: ${e.message}` }, { quoted: msg });
  }
};
