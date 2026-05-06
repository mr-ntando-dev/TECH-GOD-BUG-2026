/**
 * 🐛 Tech God Bug 2026 — Member Count Command
 * Shows detailed group member statistics.
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
    const groupMeta  = await sock.groupMetadata(jid);
    const total      = groupMeta.participants.length;
    const admins     = groupMeta.participants.filter(p => p.admin).length;
    const superAdmins = groupMeta.participants.filter(p => p.admin === 'superadmin').length;
    const members    = total - admins;
    const created    = groupMeta.creation
      ? new Date(groupMeta.creation * 1000).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Unknown';

    await antiban.sendHuman(sock, jid, {
      text: [
        `👥 *Group Stats — ${groupMeta.subject}*`,
        ``,
        `📊 *Members:*`,
        `  ╰┈➤ Total: *${total}*`,
        `  ╰┈➤ Regular Members: *${members}*`,
        `  ╰┈➤ Admins: *${admins}*`,
        `  ╰┈➤ Super Admins: *${superAdmins}*`,
        ``,
        `📅 *Created:* ${created}`,
        `🔒 *Restricted:* ${groupMeta.restrict ? 'Yes (admins only)' : 'No (open)'}`,
        `📣 *Announce Mode:* ${groupMeta.announce ? 'On' : 'Off'}`,
        ``,
        `_🐛 Tech God Bug 2026 · ${config.botName}_`,
      ].join('\n'),
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed: ${e.message}` }, { quoted: msg });
  }
};
