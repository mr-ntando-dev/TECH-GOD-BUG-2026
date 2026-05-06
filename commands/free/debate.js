/**
 * 🐛 Tech God Bug 2026 — Debate Command
 * AI argues both sides of any topic.
 * By Dev-Ntando
 */
'use strict';

const { chatAI } = require('../../utils/api');
const config     = require('../../config');
const antiban    = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const topic = args.join(' ').trim();

  if (!topic) {
    return antiban.sendHuman(sock, jid, {
      text: `⚔️ *Debate Command*\n\n*Usage:* ${config.prefix}debate <topic>\n*Example:* ${config.prefix}debate Android vs iPhone\n\n_Bug argues BOTH sides and gives a verdict!_`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: `⚔️ _Bug is preparing both sides of the debate..._` }, { quoted: msg });

  let debate;
  try {
    debate = await chatAI(
      `Debate the topic: "${topic}". Structure your response as:
FOR: [2-3 strong points in favour]
AGAINST: [2-3 strong points against]
VERDICT: [1 sentence final verdict]

Keep it punchy and entertaining.`,
      'You are a sharp debate moderator who presents both sides fairly then gives a decisive verdict.',
    );
  } catch {
    debate = 'FOR: Makes sense.\nAGAINST: Also makes sense.\nVERDICT: It\'s complicated. 🤷';
  }

  await antiban.sendHuman(sock, jid, {
    text: `⚔️ *Debate: ${topic}*\n\n${debate.trim()}\n\n🐛 _Bug has spoken · ${config.botName}_`,
  }, { quoted: msg });
};
