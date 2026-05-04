/**
 * 🐛 Tech God Bug 2026 — TikTok Downloader
 * By Dev-Ntando
 */
'use strict';
const { fetchJson, fetchBuffer } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');
const db      = require('../../database');

module.exports = async (sock, msg, args, { jid, sender }) => {
  const url = args[0];
  if (!url || !url.includes('tiktok')) {
    return antiban.sendHuman(sock, jid, { text: `📥 *TikTok DL*\n\n*Usage:* ${config.prefix}tiktok <url>` }, { quoted: msg });
  }

  // Check limits
  const isPrem = db.isPremium(sender);
  const limit = isPrem ? config.limits.premium.tiktok : config.limits.free.tiktok;
  const used = db.getDailyUsage(sender, 'tiktok');
  if (used >= limit) {
    return antiban.sendHuman(sock, jid, { text: `❌ Daily TikTok limit reached (${limit}/${limit}).\n💎 Upgrade to premium for more!` }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: '📥 _Downloading TikTok..._' }, { quoted: msg });

  try {
    const api = await fetchJson(`https://api.dreaded.site/api/tiktok?url=${encodeURIComponent(url)}`);
    const videoUrl = api.result?.video || api.result?.url || api.video;
    if (!videoUrl) throw new Error('No video found');

    const buffer = await fetchBuffer(videoUrl);
    await sock.sendMessage(jid, { video: buffer, caption: `📥 *TikTok Downloaded*\n\n_🐛 Tech God Bug 2026_` }, { quoted: msg });
    db.incrementDailyUsage(sender, 'tiktok');
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ TikTok download failed: ${e.message}` }, { quoted: msg });
  }
};
