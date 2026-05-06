/**
 * 🐛 Tech God Bug 2026 — Haiku Generator
 * Writes a haiku about any topic using AI.
 * By Dev-Ntando
 */
'use strict';

const { chatAI } = require('../../utils/api');
const config     = require('../../config');
const antiban    = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const topic = args.join(' ').trim() || 'technology and chaos';

  await antiban.sendHuman(sock, jid, { text: '🌸 _Composing your haiku..._' }, { quoted: msg });

  let haiku;
  try {
    haiku = await chatAI(
      `Write one traditional haiku (5-7-5 syllables) about: "${topic}". Output ONLY the three lines, no title, no explanation.`,
      'You are a haiku poet. Follow 5-7-5 syllable structure strictly.',
    );
  } catch {
    haiku = 'Bug met an error\nThe API said goodbye\nHaiku gone offline';
  }

  await antiban.sendHuman(sock, jid, {
    text: `🌸 *Haiku · ${topic}*\n\n_${haiku.trim()}_\n\n✍️ _Bug AI · ${config.botName}_`,
  }, { quoted: msg });
};
