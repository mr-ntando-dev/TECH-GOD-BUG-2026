/**
 * 🐛 Tech God Bug 2026 — GitHub Search Command
 * Searches GitHub for a user profile or repository.
 * By Dev-Ntando
 */
'use strict';

const { fetchJson } = require('../../utils/api');
const config        = require('../../config');
const antiban       = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const type  = (args[0] || '').toLowerCase();
  const query = args.slice(1).join(' ').trim();

  if (!query || !['user', 'repo'].includes(type)) {
    return antiban.sendHuman(sock, jid, {
      text: [
        `🐙 *GitHub Search*`,
        ``,
        `*Usage:*`,
        `  ${config.prefix}github user <username>`,
        `  ${config.prefix}github repo <owner/repo>`,
        ``,
        `*Examples:*`,
        `  ${config.prefix}github user mr-ntando-dev`,
        `  ${config.prefix}github repo mr-ntando-dev/TECH-GOD-BUG-2026`,
      ].join('\n'),
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: `🐙 _Fetching GitHub ${type} info..._` }, { quoted: msg });

  try {
    if (type === 'user') {
      const user = await fetchJson(`https://api.github.com/users/${query}`);
      if (user.message === 'Not Found') throw new Error(`User "${query}" not found`);

      await antiban.sendHuman(sock, jid, {
        text: [
          `🐙 *GitHub User: ${user.login}*`,
          ``,
          `👤 *Name:* ${user.name || 'N/A'}`,
          `🏢 *Company:* ${user.company || 'N/A'}`,
          `📍 *Location:* ${user.location || 'N/A'}`,
          `🔗 *Blog:* ${user.blog || 'N/A'}`,
          ``,
          `📊 *Stats:*`,
          `  ╰┈➤ Public Repos: ${user.public_repos}`,
          `  ╰┈➤ Followers: ${user.followers}`,
          `  ╰┈➤ Following: ${user.following}`,
          ``,
          `📅 *Joined:* ${new Date(user.created_at).toLocaleDateString('en-ZA')}`,
          `🔗 ${user.html_url}`,
          ``,
          `_🐛 Tech God Bug 2026_`,
        ].join('\n'),
      }, { quoted: msg });
    } else {
      const repo = await fetchJson(`https://api.github.com/repos/${query}`);
      if (repo.message === 'Not Found') throw new Error(`Repo "${query}" not found`);

      await antiban.sendHuman(sock, jid, {
        text: [
          `📦 *GitHub Repo: ${repo.full_name}*`,
          ``,
          `📝 *Description:* ${repo.description || 'N/A'}`,
          `🔤 *Language:* ${repo.language || 'N/A'}`,
          `📄 *License:* ${repo.license?.name || 'N/A'}`,
          ``,
          `📊 *Stats:*`,
          `  ╰┈➤ ⭐ Stars: ${repo.stargazers_count.toLocaleString()}`,
          `  ╰┈➤ 🍴 Forks: ${repo.forks_count.toLocaleString()}`,
          `  ╰┈➤ 👁️ Watchers: ${repo.watchers_count.toLocaleString()}`,
          `  ╰┈➤ ⚠️ Open Issues: ${repo.open_issues_count.toLocaleString()}`,
          ``,
          `📅 *Updated:* ${new Date(repo.updated_at).toLocaleDateString('en-ZA')}`,
          `🔗 ${repo.html_url}`,
          ``,
          `_🐛 Tech God Bug 2026_`,
        ].join('\n'),
      }, { quoted: msg });
    }
  } catch (e) {
    await antiban.sendHuman(sock, jid, {
      text: `❌ ${e.message}`,
    }, { quoted: msg });
  }
};
