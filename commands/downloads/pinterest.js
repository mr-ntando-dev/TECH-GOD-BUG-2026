'use strict';
const { fetchJson, fetchBuffer } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const url = args[0];
  if (!url || !url.includes('pinterest')) {
    return antiban.sendHuman(sock, jid, { text: `📥 *Pinterest DL*\n\n*Usage:* ${config.prefix}pin <url>` }, { quoted: msg });
  }
  await antiban.sendHuman(sock, jid, { text: '📥 _Downloading from Pinterest..._' }, { quoted: msg });
  try {
    const api = await fetchJson(`https://api.dreaded.site/api/pinterest?url=${encodeURIComponent(url)}`);
    const imgUrl = api.result?.url || api.result;
    if (!imgUrl) throw new Error('No image found');
    const buffer = await fetchBuffer(imgUrl);
    await sock.sendMessage(jid, { image: buffer, caption: '📌 _Downloaded from Pinterest_\n\n_🐛 Tech God Bug 2026_' }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Pinterest download failed: ${e.message}` }, { quoted: msg });
  }
};
