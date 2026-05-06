/**
 * 🐛 Tech God Bug 2026 — Lock / Unlock Group
 * Restricts or allows group message sending (admins only).
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { isOwner, sender, jid, isGroup }) => {
  if (!isGroup) {
    return antiban.sendHuman(sock, jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
  }

  const groupMeta = await sock.groupMetadata(jid);
  const isAdmin   = groupMeta.participants.find(p => p.id === sender)?.admin;

  if (!isAdmin && !isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
  }

  const subCmd = (args[0] || '').toLowerCase();

  if (!['lock', 'unlock'].includes(subCmd) && !msg.message?.extendedTextMessage?.text?.includes('lock') && !msg.message?.extendedTextMessage?.text?.includes('unlock')) {
    // Determine from command name in the message
  }

  // Infer from the text of the actual command used
  const rawText = (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text || ''
  ).toLowerCase();

  const locking = rawText.includes('lock') && !rawText.includes('unlock');

  try {
    await sock.groupSettingUpdate(jid, locking ? 'announcement' : 'not_announcement');
    await antiban.sendHuman(sock, jid, {
      text: locking
        ? `🔒 *Group Locked!*\n\n_Only admins can send messages now._\n_Use ${config.prefix}unlock to reopen._`
        : `🔓 *Group Unlocked!*\n\n_All members can send messages again._`,
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed to update group settings: ${e.message}` }, { quoted: msg });
  }
};
