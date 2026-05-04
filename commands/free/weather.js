/**
 * 🐛 Tech God Bug 2026 — Weather Command
 * By Dev-Ntando
 */
'use strict';
const { fetchJson } = require('../../utils/api');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const city = args.join(' ').trim();
  if (!city) {
    return antiban.sendHuman(sock, jid, { text: `🌤️ *Usage:* ${config.prefix}weather <city>\n*Example:* ${config.prefix}weather Harare` }, { quoted: msg });
  }

  try {
    const data = await fetchJson(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    const cur = data.current_condition?.[0];
    if (!cur) throw new Error('No data');

    const text = [
      `🌤️ *Weather for ${city}*`,
      '',
      `🌡️ *Temp:* ${cur.temp_C}°C (${cur.temp_F}°F)`,
      `🌡️ *Feels like:* ${cur.FeelsLikeC}°C`,
      `💧 *Humidity:* ${cur.humidity}%`,
      `💨 *Wind:* ${cur.windspeedKmph} km/h ${cur.winddir16Point}`,
      `☁️ *Condition:* ${cur.weatherDesc?.[0]?.value || 'N/A'}`,
      `👁️ *Visibility:* ${cur.visibility} km`,
      '',
      `_🐛 Tech God Bug 2026_`,
    ].join('\n');

    await antiban.sendHuman(sock, jid, { text }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ Could not fetch weather data. Check the city name.' }, { quoted: msg });
  }
};
