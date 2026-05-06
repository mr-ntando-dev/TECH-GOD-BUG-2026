/**
 * 🐛 Tech God Bug 2026 — Rizz Command
 * AI-powered rizz lines / flirty pickup lines.
 * By Dev-Ntando
 */
'use strict';

const { chatAI }  = require('../../utils/api');
const config      = require('../../config');
const antiban     = require('../../utils/antiban');

const LINES = [
  'Are you a compiler error? Because I can\'t get you out of my head.',
  'Do you have a map? I keep getting lost in your eyes.',
  'Are you Wi-Fi? Because I\'m feeling a connection.',
  'Is your name Google? Because you have everything I\'ve been searching for.',
  'Are you a WhatsApp notification? Because you make my heart buzz.',
  'Do you run on batteries? Because you light up my world.',
  'Are you a bug? Because you crashed my heart.exe.',
  'If you were code, you\'d be the function that makes everything else work.',
];

module.exports = async (sock, msg, args, { sender, jid }) => {
  const target = args.join(' ').trim();

  await antiban.sendHuman(sock, jid, { text: '💘 _Generating max rizz..._' }, { quoted: msg });

  let line;
  try {
    const prompt = target
      ? `Give me ONE witty, smooth, and funny rizz/pickup line for someone named "${target}". Keep it short (1-2 sentences), clever, and include a nerdy or tech twist. No introductory text, just the line itself.`
      : 'Give me ONE witty, smooth, and funny rizz/pickup line. Keep it short (1-2 sentences), clever, and include a nerdy or tech twist. No introductory text, just the line itself.';
    line = await chatAI(prompt, 'You are a hilarious smooth-talker with nerdy charm.');
  } catch {
    line = LINES[Math.floor(Math.random() * LINES.length)];
  }

  const tag = target ? `💘 *Rizz for ${target}:*` : '💘 *Today\'s Rizz Line:*';

  await antiban.sendHuman(sock, jid, {
    text: `${tag}\n\n_"${line.trim()}"_\n\n🐛 _Tech God Bug 2026 · rizz level: MAX_`,
  }, { quoted: msg });
};
