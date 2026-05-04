/**
 * 🐛 Tech God Bug 2026 — Summarize Command
 * By Dev-Ntando
 */
'use strict';
const { chatAI } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const text = args.join(' ').trim() || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || '';
  if (!text) {
    return antiban.sendHuman(sock, jid, { text: `📝 *Usage:* ${config.prefix}summarize <text>\n_Or reply to a message with ${config.prefix}tldr_` }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: '📝 _Summarizing..._' }, { quoted: msg });
  const summary = await chatAI(`Summarize this in 2-3 sentences: ${text}`, 'You are a concise summarizer.');
  await antiban.sendHuman(sock, jid, { text: `📝 *Summary:*\n\n${summary}` }, { quoted: msg });
};
