/**
 * 🐛 Tech God Bug 2026 — Rate Command
 * Humorously rates anything out of 10 using AI.
 * By Dev-Ntando
 */
'use strict';

const { chatAI } = require('../../utils/api');
const config     = require('../../config');
const antiban    = require('../../utils/antiban');

const RATINGS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '420', '69', '100'];

module.exports = async (sock, msg, args, { jid }) => {
  const thing = args.join(' ').trim();

  if (!thing) {
    return antiban.sendHuman(sock, jid, {
      text: `📊 *Rate Command*\n\n*Usage:* ${config.prefix}rate <anything>\n*Example:* ${config.prefix}rate my best friend\n\n_Bug will give it a score out of 10._`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: `🔍 _Analysing "${thing}"..._` }, { quoted: msg });

  let score, roast;
  const randomScore = RATINGS[Math.floor(Math.random() * RATINGS.length)];

  try {
    const reply = await chatAI(
      `Rate "${thing}" out of 10 in a single short, witty, savage one-liner. Start with a number like "7/10" then give a brutally honest funny reason. Keep it under 2 sentences.`,
      'You are a brutally honest but funny critic who rates anything with wit and no filter.',
    );
    roast = reply.trim();
  } catch {
    roast = `${randomScore}/10 — honestly, it is what it is.`;
  }

  await antiban.sendHuman(sock, jid, {
    text: `📊 *Rating: ${thing}*\n\n${roast}\n\n_🐛 Bug's verdict is final._`,
  }, { quoted: msg });
};
