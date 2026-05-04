/**
 * 🐛 Tech God Bug 2026 — Ping Command
 * By Dev-Ntando
 */
'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const start = Date.now();
  await antiban.sendHuman(sock, jid, { text: '🏓 _Pinging..._' }, { quoted: msg });
  const latency = Date.now() - start;
  const up = process.uptime();
  const upStr = `${Math.floor(up/3600)}h ${Math.floor((up%3600)/60)}m ${Math.floor(up%60)}s`;

  await antiban.sendHuman(sock, jid, {
    text: `🏓 *Pong!*\n\n⚡ *Latency:* ${latency}ms\n📡 *Status:* Online\n⏱️ *Uptime:* ${upStr}\n🐛 *Bot:* ${config.botName} v${config.botVersion}`,
  }, { quoted: msg });
};
