/**
 * 🐛 Tech God Bug 2026 — Quote Command
 * By Dev-Ntando
 */
'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  try {
    const data = await fetchJson('https://api.quotable.io/random');
    const quote = data.content || 'Stay focused and never give up.';
    const author = data.author || 'Unknown';
    await antiban.sendHuman(sock, jid, { text: `💬 *Quote of the Moment:*\n\n"${quote}"\n\n— *${author}*` }, { quoted: msg });
  } catch {
    const fallback = [
      '"The only way to do great work is to love what you do." — Steve Jobs',
      '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
      '"First, solve the problem. Then, write the code." — John Johnson',
    ];
    await antiban.sendHuman(sock, jid, { text: `💬 *Quote:*\n\n${fallback[Math.floor(Math.random() * fallback.length)]}` }, { quoted: msg });
  }
};
