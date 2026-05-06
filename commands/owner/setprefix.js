/**
 * 🐛 Tech God Bug 2026 — Set Prefix Command
 * Owner only: changes the bot command prefix at runtime.
 * By Dev-Ntando
 */
'use strict';

const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { isOwner, jid }) => {
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Owner only command.' }, { quoted: msg });
  }

  const newPrefix = args[0]?.trim();

  if (!newPrefix || newPrefix.length > 3) {
    return antiban.sendHuman(sock, jid, {
      text: `⚙️ *Set Prefix*\n\n*Usage:* ${config.prefix}setprefix <new prefix>\n*Example:* ${config.prefix}setprefix !\n\n_Current prefix: *${config.prefix}*_\n_Max 3 characters._`,
    }, { quoted: msg });
  }

  const oldPrefix = config.prefix;
  config.prefix   = newPrefix;

  await antiban.sendHuman(sock, jid, {
    text: [
      `⚙️ *Prefix Updated!*`,
      ``,
      `🔄 *Old prefix:* ${oldPrefix}`,
      `✅ *New prefix:* ${newPrefix}`,
      ``,
      `_Example: *${newPrefix}menu*, *${newPrefix}help*_`,
      ``,
      `_⚠️ This change is temporary until bot restarts._`,
      `_To make permanent, update PREFIX in your .env file._`,
      `_🐛 Tech God Bug 2026_`,
    ].join('\n'),
  }, { quoted: msg });
};
