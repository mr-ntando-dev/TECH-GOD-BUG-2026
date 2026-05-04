/**
 * 🐛 Tech God Bug 2026 — YouTube MP4 Downloader
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
    return antiban.sendHuman(sock, jid, { text: `🎬 *YouTube Video*\n\n*Usage:* ${config.prefix}video <name or url>` }, { quoted: msg });
  }

  const isPrem = db.isPremium(sender);
  const limit = isPrem ? config.limits.premium.video : config.limits.free.video;
  const used = db.getDailyUsage(sender, 'video');
  if (used >= limit) {
    return antiban.sendHuman(sock, jid, { text: `❌ Daily video limit reached (${limit}/${limit}).\n💎 Upgrade to premium!` }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: '🎬 _Downloading video..._' }, { quoted: msg });

  try {
    const api = await fetchJson(`https://api.dreaded.site/api/ytmp4?url=${encodeURIComponent(query)}`);
    const videoUrl = api.result?.url || api.result?.download || api.url;
    const title = api.result?.title || query;
    if (!videoUrl) throw new Error('No video found');

    const buffer = await fetchBuffer(videoUrl);
    await sock.sendMessage(jid, { video: buffer, caption: `🎬 *${title}*\n\n_🐛 Tech God Bug 2026_` }, { quoted: msg });
    db.incrementDailyUsage(sender, 'video');
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Video download failed: ${e.message}` }, { quoted: msg });
  }
};
