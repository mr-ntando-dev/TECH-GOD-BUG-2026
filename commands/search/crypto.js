/**
 * 🐛 Tech God Bug 2026 — Crypto Price Command
 * Fetches live crypto prices via CoinGecko public API.
 * By Dev-Ntando
 */
'use strict';

const { fetchJson } = require('../../utils/api');
const config        = require('../../config');
const antiban       = require('../../utils/antiban');

const COIN_MAP = {
  btc: 'bitcoin', eth: 'ethereum', bnb: 'binancecoin', sol: 'solana',
  ada: 'cardano', doge: 'dogecoin', xrp: 'ripple', dot: 'polkadot',
  matic: 'matic-network', ltc: 'litecoin', avax: 'avalanche-2', shib: 'shiba-inu',
};

function trend(pct) {
  if (pct === null || pct === undefined) return '—';
  return pct >= 0 ? `📈 +${pct.toFixed(2)}%` : `📉 ${pct.toFixed(2)}%`;
}

module.exports = async (sock, msg, args, { jid }) => {
  const raw = (args[0] || 'btc').toLowerCase();
  const coinId = COIN_MAP[raw] || raw;

  await antiban.sendHuman(sock, jid, { text: `💰 _Fetching ${raw.toUpperCase()} price..._` }, { quoted: msg });

  try {
    const data = await fetchJson(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd,zar&include_24hr_change=true&include_market_cap=true`,
    );

    const coin = data[coinId];
    if (!coin) throw new Error(`Coin "${raw}" not found. Try: btc, eth, bnb, sol, doge, xrp`);

    const usd = coin.usd?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || 'N/A';
    const zar = coin.zar?.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' }) || 'N/A';
    const pct = coin.usd_24h_change;
    const cap = coin.usd_market_cap;
    const capStr = cap ? `$${(cap / 1e9).toFixed(2)}B` : 'N/A';

    await antiban.sendHuman(sock, jid, {
      text: [
        `💰 *${raw.toUpperCase()} Price*`,
        ``,
        `💵 *USD:* ${usd}`,
        `🇿🇦 *ZAR:* ${zar}`,
        `📊 *24h Change:* ${trend(pct)}`,
        `🏦 *Market Cap:* ${capStr}`,
        ``,
        `_Data: CoinGecko · 🐛 Tech God Bug 2026_`,
      ].join('\n'),
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, {
      text: `❌ ${e.message}\n\n_Try: ${config.prefix}crypto btc or ${config.prefix}crypto ethereum_`,
    }, { quoted: msg });
  }
};
