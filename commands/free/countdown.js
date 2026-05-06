/**
 * 🐛 Tech God Bug 2026 — Countdown Command
 * Calculates time remaining until a future date/event.
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const input = args.join(' ').trim();

  if (!input) {
    return antiban.sendHuman(sock, jid, {
      text: `⏳ *Countdown Command*\n\n*Usage:* ${config.prefix}countdown <date or date + label>\n*Examples:*\n  ${config.prefix}countdown 2026-12-25\n  ${config.prefix}countdown 2026-12-25 Christmas\n  ${config.prefix}countdown 2027-01-01 New Year 2027\n\n_Date format: YYYY-MM-DD_`,
    }, { quoted: msg });
  }

  const dateMatch = input.match(/(\d{4}-\d{2}-\d{2})/);
  if (!dateMatch) {
    return antiban.sendHuman(sock, jid, { text: '❌ Date not recognised. Use format: YYYY-MM-DD\n*Example:* 2026-12-25' }, { quoted: msg });
  }

  const dateStr  = dateMatch[1];
  const label    = input.replace(dateStr, '').trim() || 'The Event';
  const target   = new Date(dateStr + 'T00:00:00');
  const now      = new Date();

  if (isNaN(target.getTime())) {
    return antiban.sendHuman(sock, jid, { text: '❌ Invalid date.' }, { quoted: msg });
  }

  const diff = target - now;

  if (diff < 0) {
    return antiban.sendHuman(sock, jid, { text: `⌛ *${label}* already passed on ${dateStr}. You snooze, you lose.` }, { quoted: msg });
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  await antiban.sendHuman(sock, jid, {
    text: [
      `⏳ *Countdown to: ${label}*`,
      ``,
      `📅 *Target Date:* ${dateStr}`,
      ``,
      `  ⏱️ *${days}* days`,
      `  🕐 *${hours}* hours`,
      `  ⏰ *${minutes}* minutes`,
      ``,
      `_🐛 Tech God Bug 2026 · ${config.botName}_`,
    ].join('\n'),
  }, { quoted: msg });
};
