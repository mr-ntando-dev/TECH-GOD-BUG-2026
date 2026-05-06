/**
 * 🐛 Tech God Bug 2026 — Announce Command
 * Owner only: sends a styled announcement to a specific chat or group.
 * By Dev-Ntando
 */
'use strict';

const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { isOwner, jid }) => {
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Owner only command.' }, { quoted: msg });
  }

  const message = args.join(' ').trim();

  if (!message) {
    return antiban.sendHuman(sock, jid, {
      text: `📣 *Announce Command*\n\n*Usage:* ${config.prefix}announce <message>\n*Example:* ${config.prefix}announce Bot will be down for maintenance at 10PM tonight.\n\n_Sends a styled announcement to the current chat._`,
    }, { quoted: msg });
  }

  const now = new Date().toLocaleString('en-ZA', {
    timeZone: config.timezone,
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  const announcement = [
    `╔═══════════════════════════════════╗`,
    `║  📣  *A N N O U N C E M E N T*    ║`,
    `║  🐛  ${config.botName}  ║`,
    `╚═══════════════════════════════════╝`,
    ``,
    message,
    ``,
    `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
    `📅 _${now}_`,
    `👑 _Posted by Owner · ${config.botName}_`,
  ].join('\n');

  await antiban.sendHuman(sock, jid, { text: announcement }, { quoted: msg });
};
