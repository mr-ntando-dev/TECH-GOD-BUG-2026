/**
 * 🐛 Tech God Bug 2026 — Roast Command
 * By Dev-Ntando
 */
'use strict';
const { chatAI } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid, sender }) => {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const target = mentioned[0] || sender;
  const targetName = `@${target.split('@')[0].split(':')[0]}`;

  await antiban.sendHuman(sock, jid, { text: '🔥 _Cooking up a roast..._' }, { quoted: msg });

  const prompt = `Roast this person named ${targetName} in a funny but not too mean way. Keep it short (2-3 sentences). Be creative and witty.`;
  const roast = await chatAI(prompt, 'You are a savage comedian who roasts people. Keep it funny, not hateful.');

  await antiban.sendHuman(sock, jid, { text: `🔥 *Roast for* ${targetName}\n\n${roast}\n\n_🐛 Tech God Bug 2026_`, mentions: [target] }, { quoted: msg });
};
