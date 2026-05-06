/**
 * 🐛 Tech God Bug 2026 — Invite Link Command
 * Fetches the group invite link (admin only).
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
    return antiban.sendHuman(sock, jid, { text: '❌ Only admins can get the invite link.' }, { quoted: msg });
  }

  try {
    const code = await sock.groupInviteCode(jid);
    const link = `https://chat.whatsapp.com/${code}`;

    await antiban.sendHuman(sock, jid, {
      text: [
        `🔗 *Group Invite Link*`,
        ``,
        `📌 *Group:* ${groupMeta.subject}`,
        `👥 *Members:* ${groupMeta.participants.length}`,
        ``,
        `🔗 ${link}`,
        ``,
        `_Share responsibly! To reset this link use ${config.prefix}resetlink_`,
        `_🐛 Tech God Bug 2026_`,
      ].join('\n'),
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed to get invite link: ${e.message}` }, { quoted: msg });
  }
};
