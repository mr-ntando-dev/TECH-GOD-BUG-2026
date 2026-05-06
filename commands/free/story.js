/**
 * 🐛 Tech God Bug 2026 — Story Command
 * AI generates a short story based on a prompt.
 * By Dev-Ntando
 */
'use strict';

const { chatAI } = require('../../utils/api');
const config     = require('../../config');
const antiban    = require('../../utils/antiban');

module.exports = async (sock, msg, args, { sender, jid }) => {
  const prompt = args.join(' ').trim();

  if (!prompt) {
    return antiban.sendHuman(sock, jid, {
      text: `📖 *Story Generator*\n\n*Usage:* ${config.prefix}story <your prompt>\n*Example:* ${config.prefix}story a robot who falls in love with Wi-Fi\n\n_Bug AI will write you a short story!_`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: '📖 _Bug is writing your story..._' }, { quoted: msg });

  let story;
  try {
    story = await chatAI(
      `Write a short, entertaining story (4-6 paragraphs) based on this prompt: "${prompt}". Make it creative, funny, and engaging. No title header needed.`,
      'You are a creative storyteller who writes vivid, fun short stories. Keep them punchy and entertaining.',
    );
  } catch {
    story = 'Once upon a time, the API decided to take a nap. The end. 😴';
  }

  await antiban.sendHuman(sock, jid, {
    text: `📖 *Story: ${prompt}*\n\n${story.trim()}\n\n✍️ _Written by Bug AI · ${config.botName}_`,
  }, { quoted: msg });
};
