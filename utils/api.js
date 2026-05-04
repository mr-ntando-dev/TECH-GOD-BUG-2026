/**
 * 🐛 Tech God Bug 2026 — API Utilities
 * Shared API call helpers for AI, downloads, search, etc.
 * By Dev-Ntando
 */
'use strict';

const axios = require('axios');

const AI_ENDPOINTS = [
  'https://api.openai.com/v1/chat/completions',
];

async function chatAI(prompt, persona) {
  // Uses a free AI API endpoint (fallback chain)
  const endpoints = [
    {
      url: 'https://api.dreaded.site/api/chatgpt',
      method: 'get',
      params: { text: `${persona}\n\nUser: ${prompt}` },
      extract: (r) => r.data?.result || r.data?.response || r.data?.answer || 'No response',
    },
    {
      url: 'https://api.giftedtech.my.id/api/ai/gpt4',
      method: 'get',
      params: { q: prompt },
      extract: (r) => r.data?.result || r.data?.response || 'No response',
    },
  ];

  for (const ep of endpoints) {
    try {
      const res = await axios({ method: ep.method, url: ep.url, params: ep.params, timeout: 15000 });
      const text = ep.extract(res);
      if (text && text !== 'No response') return text;
    } catch {}
  }
  return 'I could not process that right now. Try again later.';
}

async function fetchJson(url, opts = {}) {
  try {
    const res = await axios.get(url, { timeout: 15000, ...opts });
    return res.data;
  } catch (e) {
    throw new Error(`API request failed: ${e.message}`);
  }
}

async function fetchBuffer(url, opts = {}) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000, ...opts });
    return Buffer.from(res.data);
  } catch (e) {
    throw new Error(`Download failed: ${e.message}`);
  }
}

module.exports = { chatAI, fetchJson, fetchBuffer };
