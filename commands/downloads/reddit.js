/**
 * 🐛 Tech God Bug 2026 — Reddit Media Downloader
 * Downloads Reddit post images/videos via Reddit JSON API.
 * By Dev-Ntando
 */
'use strict';

const { fetchJson } = require('../../utils/api');
const config        = require('../../config');
const antiban       = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const url = args[0];

  if (!url || !url.includes('reddit.com')) {
    return antiban.sendHuman(sock, jid, {
      text: `🤖 *Reddit Downloader*\n\n*Usage:* ${config.prefix}reddit <reddit post url>\n*Example:* ${config.prefix}reddit https://www.reddit.com/r/funny/comments/abc123/title/\n\n_Downloads images or videos from Reddit posts._`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: '🤖 _Fetching Reddit post..._' }, { quoted: msg });

  try {
    // Reddit has a JSON API — append .json to any post URL
    const jsonUrl = url.split('?')[0].replace(/\/$/, '') + '.json';
    const data = await fetchJson(jsonUrl);

    const post = data?.[0]?.data?.children?.[0]?.data;
    if (!post) throw new Error('Post not found');

    const { title, author, subreddit, score, num_comments, url: postUrl, is_video } = post;

    if (is_video) {
      const videoUrl = post?.media?.reddit_video?.fallback_url || post?.secure_media?.reddit_video?.fallback_url;
      await antiban.sendHuman(sock, jid, {
        text: [
          `🤖 *Reddit Video Post*`,
          ``,
          `📌 *Title:* ${title}`,
          `👤 *Author:* u/${author}`,
          `📁 *Subreddit:* r/${subreddit}`,
          `👍 *Score:* ${score.toLocaleString()}`,
          `💬 *Comments:* ${num_comments.toLocaleString()}`,
          ``,
          `🎬 *Video URL:*`,
          `${videoUrl || postUrl}`,
          ``,
          `_🐛 Tech God Bug 2026 · ${config.botName}_`,
        ].join('\n'),
      }, { quoted: msg });
    } else {
      const imageUrl = post?.url_overridden_by_dest || postUrl;
      const isImage = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(imageUrl);

      await antiban.sendHuman(sock, jid, {
        text: [
          `🤖 *Reddit Post*`,
          ``,
          `📌 *Title:* ${title}`,
          `👤 *Author:* u/${author}`,
          `📁 *Subreddit:* r/${subreddit}`,
          `👍 *Score:* ${score.toLocaleString()}`,
          `💬 *Comments:* ${num_comments.toLocaleString()}`,
          ``,
          `🔗 *Media URL:*`,
          `${imageUrl}`,
          ``,
          `_${isImage ? '📸 Image post detected.' : '🔗 External link post.'}_`,
          `_🐛 Tech God Bug 2026 · ${config.botName}_`,
        ].join('\n'),
      }, { quoted: msg });
    }
  } catch (e) {
    await antiban.sendHuman(sock, jid, {
      text: `❌ Could not fetch Reddit post.\n_Reason: ${e.message}_\n\n_Make sure you use a full post URL, not a share link._`,
    }, { quoted: msg });
  }
};
