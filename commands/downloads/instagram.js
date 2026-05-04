'use strict';
const { fetchJson, fetchBuffer } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const url = args[0];
  if (!url || !url.includes('instagram')) {
    return antiban.sendHuman(sock, jid, { text: `📥 *Instagram DL*\n\n*Usage:* ${config.prefix}ig <url>` }, { quoted: msg });
  }
  await antiban.sendHuman(sock, jid, { text: '📥 _Downloading from Instagram..._' }, { quoted: msg });
  try {
    const api = await fetchJson(`https://api.dreaded.site/api/igdl?url=${encodeURIComponent(url)}`);
    const mediaUrl = api.result?.url || api.result?.[0]?.url;
    if (!mediaUrl) throw new Error('No media found');
    const buffer = await fetchBuffer(mediaUrl);
    await sock.sendMessage(jid, { video: buffer, caption: '📥 _Downloaded from Instagram_\n\n_🐛 Tech God Bug 2026_' }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Instagram download failed: ${e.message}` }, { quoted: msg });
  }
};
