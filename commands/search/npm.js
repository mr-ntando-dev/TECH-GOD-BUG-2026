/**
 * 🐛 Tech God Bug 2026 — NPM Package Search
 * Looks up npm package info via registry.npmjs.org.
 * By Dev-Ntando
 */
'use strict';

const { fetchJson } = require('../../utils/api');
const config        = require('../../config');
const antiban       = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const pkg = args[0]?.toLowerCase().trim();

  if (!pkg) {
    return antiban.sendHuman(sock, jid, {
      text: `📦 *NPM Package Lookup*\n\n*Usage:* ${config.prefix}npm <package name>\n*Example:* ${config.prefix}npm baileys\n\n_Fetches info from the npm registry._`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: `📦 _Looking up npm package "${pkg}"..._` }, { quoted: msg });

  try {
    const data = await fetchJson(`https://registry.npmjs.org/${pkg}`);
    if (data.error) throw new Error(data.error);

    const latest = data['dist-tags']?.latest;
    const ver    = data.versions?.[latest];
    const weekDl = data.time?.[latest]
      ? new Date(data.time[latest]).toLocaleDateString('en-ZA')
      : 'N/A';

    const keywords = (ver?.keywords || []).slice(0, 6).join(', ') || 'N/A';
    const deps     = Object.keys(ver?.dependencies || {}).length;

    await antiban.sendHuman(sock, jid, {
      text: [
        `📦 *NPM: ${data.name}*`,
        ``,
        `📝 *Description:* ${data.description || 'N/A'}`,
        `🔖 *Latest Version:* ${latest || 'N/A'}`,
        `👤 *Author:* ${typeof data.author === 'object' ? data.author?.name : data.author || 'N/A'}`,
        `📄 *License:* ${ver?.license || 'N/A'}`,
        `🔗 *Homepage:* ${data.homepage || 'N/A'}`,
        ``,
        `📊 *Stats:*`,
        `  ╰┈➤ Dependencies: ${deps}`,
        `  ╰┈➤ Keywords: ${keywords}`,
        `  ╰┈➤ Published: ${weekDl}`,
        ``,
        `📥 *Install:*`,
        `  npm install ${data.name}`,
        ``,
        `🔗 https://npmjs.com/package/${data.name}`,
        ``,
        `_🐛 Tech God Bug 2026 · ${config.botName}_`,
      ].join('\n'),
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, {
      text: `❌ Package "${pkg}" not found.\n_Check spelling or try the exact package name._`,
    }, { quoted: msg });
  }
};
