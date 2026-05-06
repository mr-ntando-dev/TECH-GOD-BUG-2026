/**
 * 🐛 Tech God Bug 2026 — Rap Generator
 * AI writes a rap verse about any topic.
 * By Dev-Ntando
 */
'use strict';

const { chatAI } = require('../../utils/api');
const config     = require('../../config');
const antiban    = require('../../utils/antiban');

module.exports = async (sock, msg, args, { sender, jid }) => {
  const topic = args.join(' ').trim();

  if (!topic) {
    return antiban.sendHuman(sock, jid, {
      text: `🎤 *Rap Generator*\n\n*Usage:* ${config.prefix}rap <topic or name>\n*Example:* ${config.prefix}rap my bro who always late\n\n_Bug AI will spit bars about anything!_`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: '🎤 _Bug is in the booth..._' }, { quoted: msg });

  let verse;
  try {
    verse = await chatAI(
      `Write a 16-bar rap verse about: "${topic}". Make it rhyme well, sound hype, add some swagger. Use AABB or ABAB rhyme scheme. No title, just the bars.`,
      'You are a skilled rap lyricist. Write bars that flow, rhyme tight, and sound authentic.',
    );
  } catch {
    verse = 'Yo the API went MIA, couldn\'t deliver the bars today. 🎤';
  }

  await antiban.sendHuman(sock, jid, {
    text: `🎤 *Rap about: ${topic}*\n\n${verse.trim()}\n\n🐛 _Bug spitting bars · ${config.botName}_`,
  }, { quoted: msg });
};
