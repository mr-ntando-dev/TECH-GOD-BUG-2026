/**
 * 🐛 Tech God Bug 2026 — Magic 8-Ball
 * By Dev-Ntando
 */
'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');

const ANSWERS = [
  '🎱 Yes, definitely!', '🎱 Without a doubt.', '🎱 Most likely.',
  '🎱 Outlook good.', '🎱 Signs point to yes.', '🎱 Ask again later.',
  '🎱 Cannot predict now.', '🎱 Concentrate and ask again.',
  '🎱 Don\'t count on it.', '🎱 My reply is no.', '🎱 Very doubtful.',
  '🎱 Outlook not so good.', '🎱 It is certain!', '🎱 Better not tell you now.',
];

module.exports = async (sock, msg, args, { jid }) => {
  if (!args.length) {
    return antiban.sendHuman(sock, jid, { text: `🎱 *Usage:* ${config.prefix}8ball <question>` }, { quoted: msg });
  }
  const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
  await antiban.sendHuman(sock, jid, { text: `❓ *${args.join(' ')}*\n\n${answer}` }, { quoted: msg });
};
