/**
 * 🐛 Tech God Bug 2026 — Joke Command
 * By Dev-Ntando
 */
'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  try {
    const data = await fetchJson('https://v2.jokeapi.dev/joke/Any?type=single');
    const joke = data.joke || 'Could not fetch a joke right now.';
    await antiban.sendHuman(sock, jid, { text: `😂 *Random Joke:*\n\n${joke}` }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ Failed to fetch joke. Try again later.' }, { quoted: msg });
  }
};
