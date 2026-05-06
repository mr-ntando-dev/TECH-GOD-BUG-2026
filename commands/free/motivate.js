/**
 * 🐛 Tech God Bug 2026 — Motivate Command
 * Sends a personalised AI motivational speech to a tagged user.
 * By Dev-Ntando
 */
'use strict';

const { chatAI } = require('../../utils/api');
const config     = require('../../config');
const antiban    = require('../../utils/antiban');

module.exports = async (sock, msg, args, { sender, jid }) => {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const targetUser = mentioned[0] || sender;
  const nameTag = `@${targetUser.split('@')[0].split(':')[0]}`;
  const topic = args.filter(a => !a.startsWith('@')).join(' ').trim();

  await antiban.sendHuman(sock, jid, { text: '🔥 _Bug is charging the motivational engines..._' }, { quoted: msg });

  let speech;
  try {
    const prompt = topic
      ? `Write a short (3-4 sentence), powerful motivational message for someone struggling with "${topic}". Address them directly, be genuine and energetic, not cheesy.`
      : `Write a short (3-4 sentence), powerful and energetic motivational message to fire someone up for the day. Be direct, genuine, and inspiring — not generic.`;
    speech = await chatAI(prompt, 'You are an intense motivational coach who gives real, powerful, actionable pep talks.');
  } catch {
    speech = 'You are built different. Stop doubting yourself and go get what you deserve. The world isn\'t going to wait — and neither should you. 🔥';
  }

  await antiban.sendHuman(sock, jid, {
    text: `🔥 *Motivation for ${nameTag}:*\n\n${speech.trim()}\n\n💪 _Tech God Bug 2026 · Stay unstoppable_`,
    mentions: [targetUser],
  }, { quoted: msg });
};
