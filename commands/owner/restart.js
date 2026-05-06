/**
 * 🐛 Tech God Bug 2026 — Restart Command
 * Owner only: gracefully restarts the bot process.
 * By Dev-Ntando
 */
'use strict';

const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Owner only command.' }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, {
    text: `🔄 *Restarting ${config.botName}...*\n\n_See you on the other side. 🐛_`,
  }, { quoted: msg });

  // Give time for message to send before exit
  setTimeout(() => {
    process.exit(0); // pm2 / Docker / Render will restart automatically
  }, 1500);
};
