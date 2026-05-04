/**
 * 🐛 Tech God Bug 2026 — Fact Command
 * By Dev-Ntando
 */
'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  try {
    const data = await fetchJson('https://uselessfacts.jsph.pl/api/v2/facts/random');
    const fact = data.text || 'Could not fetch a fact right now.';
    await antiban.sendHuman(sock, jid, { text: `🧠 *Random Fact:*\n\n${fact}` }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ Failed to fetch fact. Try again later.' }, { quoted: msg });
  }
};
