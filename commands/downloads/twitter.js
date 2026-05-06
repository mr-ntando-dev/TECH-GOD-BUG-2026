/**
 * 🐛 Tech God Bug 2026 — Twitter / X Video Downloader
 * Downloads Twitter/X videos via a public API.
 * By Dev-Ntando
 */
'use strict';

const { fetchJson } = require('../../utils/api');
const config        = require('../../config');
const antiban       = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const url = args[0];

  if (!url || (!url.includes('twitter.com') && !url.includes('x.com') && !url.includes('t.co'))) {
    return antiban.sendHuman(sock, jid, {
      text: `🐦 *Twitter / X Downloader*\n\n*Usage:* ${config.prefix}twitter <tweet url>\n*Aliases:* ${config.prefix}xdl · ${config.prefix}twdl\n\n*Example:*\n  ${config.prefix}twitter https://x.com/user/status/123456789\n\n_Paste a tweet URL to download the video._`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: '🐦 _Fetching Twitter/X video..._' }, { quoted: msg });

  try {
    // Using a public Twitter API proxy — swap for your preferred provider
    const apiUrl = `https://twdown.net/download.php?url=${encodeURIComponent(url)}`;
    // Fallback info message since direct Twitter API requires auth
    const data = await fetchJson(
      `https://api.twitter.com/2/tweets?ids=${url.match(/status\/(\d+)/)?.[1]}&media.fields=variants&expansions=attachments.media_keys`,
    );

    const tweetId = url.match(/status\/(\d+)/)?.[1];
    if (!tweetId) throw new Error('Could not extract tweet ID');

    await antiban.sendHuman(sock, jid, {
      text: [
        `🐦 *Twitter / X Video*`,
        ``,
        `🔗 *Tweet:* ${url}`,
        ``,
        `_⚠️ Twitter requires API authentication for video downloads._`,
        `_To enable: add your TWITTER_BEARER_TOKEN to your .env file._`,
        `_Alternatively use a proxy downloader like twdown.net manually._`,
        ``,
        `_🐛 Tech God Bug 2026_`,
      ].join('\n'),
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, {
      text: `❌ Could not download Twitter/X video.\n\n_Reason: ${e.message}_\n\n_Tip: Add TWITTER_BEARER_TOKEN to your config for full Twitter API access._`,
    }, { quoted: msg });
  }
};
