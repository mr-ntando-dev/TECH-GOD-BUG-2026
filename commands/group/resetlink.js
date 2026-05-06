/**
 * 🐛 Tech God Bug 2026 — Reset Invite Link
 * Revokes and regenerates the group invite link (admin only).
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
    return antiban.sendHuman(sock, jid, { text: '❌ Only admins can reset the invite link.' }, { quoted: msg });
  }

  try {
    await sock.groupRevokeInvite(jid);
    const newCode = await sock.groupInviteCode(jid);
    const newLink = `https://chat.whatsapp.com/${newCode}`;

    await antiban.sendHuman(sock, jid, {
      text: [
        `🔄 *Invite Link Reset!*`,
        ``,
        `✅ Old link has been revoked.`,
        ``,
        `🔗 *New Link:*`,
        `${newLink}`,
        ``,
        `_🐛 Tech God Bug 2026_`,
      ].join('\n'),
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed to reset link: ${e.message}` }, { quoted: msg });
  }
};
