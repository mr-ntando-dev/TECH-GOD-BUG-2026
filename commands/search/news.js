'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  try {
    const data = await fetchJson('https://newsapi.org/v2/top-headlines?country=za&pageSize=5&apiKey=demo');
    const articles = data.articles || [];
    if (!articles.length) throw new Error('No news');
    const text = articles.map((a, i) => `${i+1}. *${a.title}*\n   _${a.source?.name || ''}_`).join('\n\n');
    await antiban.sendHuman(sock, jid, { text: `📰 *Latest News*\n\n${text}\n\n_🐛 Tech God Bug 2026_` }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ Could not fetch news right now.' }, { quoted: msg });
  }
};
