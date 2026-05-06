/**
 * 🐛 Tech God Bug 2026 — Choose Command
 * Randomly picks one option from a comma-separated list.
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const raw = args.join(' ').trim();

  if (!raw || !raw.includes(',')) {
    return antiban.sendHuman(sock, jid, {
      text: `🎲 *Choose Command*\n\n*Usage:* ${config.prefix}choose <option1, option2, option3...>\n*Example:* ${config.prefix}choose pizza, jollof, pap, braai\n\n_Bug will pick one for you!_`,
    }, { quoted: msg });
  }

  const options = raw.split(',').map(o => o.trim()).filter(Boolean);
  if (options.length < 2) {
    return antiban.sendHuman(sock, jid, { text: '❌ Give me at least 2 options separated by commas.' }, { quoted: msg });
  }

  const chosen = options[Math.floor(Math.random() * options.length)];
  const rest = options.filter(o => o !== chosen);

  await antiban.sendHuman(sock, jid, {
    text: `🎲 *Bug has decided:*\n\n✅ *${chosen}*\n\n❌ _${rest.join(', ')}_\n\n_No debates. Bug has spoken. 🐛_`,
  }, { quoted: msg });
};
