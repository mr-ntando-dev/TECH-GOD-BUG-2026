/**
 * 🐛 Tech God Bug 2026 — Set Group Description
 * Updates the group description (admin only).
 * By Dev-Ntando
 */
'use strict';

const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { isOwner, sender, jid, isGroup }) => {
  if (!isGroup) {
    return antiban.sendHuman(sock, jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
  }

  const groupMeta = await sock.groupMetadata(jid);
  const isAdmin   = groupMeta.participants.find(p => p.id === sender)?.admin;

  if (!isAdmin && !isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Only admins can change the group description.' }, { quoted: msg });
  }

  const newDesc = args.join(' ').trim();

  if (!newDesc) {
    return antiban.sendHuman(sock, jid, {
      text: `📝 *Set Group Description*\n\n*Usage:* ${config.prefix}setdesc <new description>\n*Example:* ${config.prefix}setdesc Welcome to Tech God Bug 2026 — the most dangerous bot on WhatsApp 🐛`,
    }, { quoted: msg });
  }

  try {
    await sock.groupUpdateDescription(jid, newDesc);
    await antiban.sendHuman(sock, jid, {
      text: `✅ *Group description updated!*\n\n📝 _${newDesc}_\n\n_🐛 Tech God Bug 2026_`,
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed to update description: ${e.message}` }, { quoted: msg });
  }
};
