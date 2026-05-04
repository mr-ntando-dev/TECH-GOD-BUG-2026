/**
 * 🐛 Tech God Bug 2026 — Time Command
 * By Dev-Ntando
 */
'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const now = new Date().toLocaleString('en-ZA', {
    timeZone: config.timezone,
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  await antiban.sendHuman(sock, jid, { text: `🕐 *Current Time*\n\n📅 ${now}\n🌍 Timezone: ${config.timezone}` }, { quoted: msg });
};
