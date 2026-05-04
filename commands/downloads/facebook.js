'use strict';
const { fetchJson, fetchBuffer } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const url = args[0];
  if (!url || (!url.includes('facebook') && !url.includes('fb.'))) {
    return antiban.sendHuman(sock, jid, { text: `📥 *Facebook DL*\n\n*Usage:* ${config.prefix}fb <url>` }, { quoted: msg });
  }
  await antiban.sendHuman(sock, jid, { text: '📥 _Downloading from Facebook..._' }, { quoted: msg });
  try {
    const api = await fetchJson(`https://api.dreaded.site/api/fbdl?url=${encodeURIComponent(url)}`);
    const videoUrl = api.result?.url || api.result?.hd || api.result?.sd;
    if (!videoUrl) throw new Error('No video found');
    const buffer = await fetchBuffer(videoUrl);
    await sock.sendMessage(jid, { video: buffer, caption: '📥 _Downloaded from Facebook_\n\n_🐛 Tech God Bug 2026_' }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Facebook download failed: ${e.message}` }, { quoted: msg });
  }
};
