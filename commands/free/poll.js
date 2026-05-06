/**
 * 🐛 Tech God Bug 2026 — Poll Command
 * Creates a simple text-based poll in the chat.
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');

const NUMBER_EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports = async (sock, msg, args, { jid }) => {
  const raw = args.join(' ').trim();

  if (!raw || !raw.includes('|')) {
    return antiban.sendHuman(sock, jid, {
      text: `📊 *Poll Command*\n\n*Usage:* ${config.prefix}poll Question | Option1 | Option2 | Option3\n*Example:* ${config.prefix}poll Best food? | Pizza | Jollof | Braai | Pap\n\n_Separate question and options with *|* (pipe)._`,
    }, { quoted: msg });
  }

  const parts = raw.split('|').map(p => p.trim()).filter(Boolean);
  const question = parts[0];
  const options  = parts.slice(1);

  if (options.length < 2) {
    return antiban.sendHuman(sock, jid, { text: '❌ Provide at least 2 options after the *|* separator.' }, { quoted: msg });
  }

  if (options.length > 10) {
    return antiban.sendHuman(sock, jid, { text: '❌ Maximum 10 options allowed.' }, { quoted: msg });
  }

  const optLines = options.map((o, i) => `${NUMBER_EMOJIS[i]} ${o}`).join('\n');

  await antiban.sendHuman(sock, jid, {
    text: [
      `📊 *POLL*`,
      ``,
      `❓ *${question}*`,
      ``,
      optLines,
      ``,
      `_Reply with the number emoji to vote!_`,
      `_🐛 Tech God Bug 2026_`,
    ].join('\n'),
  }, { quoted: msg });
};
