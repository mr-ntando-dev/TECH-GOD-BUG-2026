/**
 * 🐛 Tech God Bug 2026 — List Admins Command
 * Lists all admins in the current group.
 * By Dev-Ntando
 */
'use strict';

const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid, isGroup }) => {
  if (!isGroup) {
    return antiban.sendHuman(sock, jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
  }

  try {
    const groupMeta = await sock.groupMetadata(jid);
    const admins    = groupMeta.participants.filter(p => p.admin);

    if (!admins.length) {
      return antiban.sendHuman(sock, jid, { text: '❌ No admins found in this group.' }, { quoted: msg });
    }

    const adminLines = admins.map((a, i) => {
      const num  = a.id.split('@')[0].split(':')[0];
      const role = a.admin === 'superadmin' ? '👑 Super Admin' : '🛡️ Admin';
      return `${i + 1}. @${num} — ${role}`;
    }).join('\n');

    const mentions = admins.map(a => a.id);

    await antiban.sendHuman(sock, jid, {
      text: [
        `🛡️ *Group Admins — ${groupMeta.subject}*`,
        ``,
        adminLines,
        ``,
        `📊 *${admins.length}* admin(s) out of *${groupMeta.participants.length}* members`,
        ``,
        `_🐛 Tech God Bug 2026_`,
      ].join('\n'),
      mentions,
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed to fetch admins: ${e.message}` }, { quoted: msg });
  }
};
