/**
 * 🐛 Tech God Bug 2026 — Recipe Search Command
 * Finds recipes via MealDB public API.
 * By Dev-Ntando
 */
'use strict';

const { fetchJson } = require('../../utils/api');
const config        = require('../../config');
const antiban       = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const query = args.join(' ').trim();

  if (!query) {
    return antiban.sendHuman(sock, jid, {
      text: `🍽️ *Recipe Search*\n\n*Usage:* ${config.prefix}recipe <food name>\n*Example:* ${config.prefix}recipe chicken\n\n_Finds a recipe from the MealDB database._`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: `🍽️ _Searching recipes for "${query}"..._` }, { quoted: msg });

  try {
    const data = await fetchJson(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
    );

    const meal = data?.meals?.[0];
    if (!meal) throw new Error(`No recipe found for "${query}"`);

    // Build ingredients list
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing  = meal[`strIngredient${i}`]?.trim();
      const meas = meal[`strMeasure${i}`]?.trim();
      if (ing) ingredients.push(`${meas ? meas + ' ' : ''}${ing}`);
    }

    // Truncate instructions to keep message short
    const instructions = meal.strInstructions
      ? meal.strInstructions.replace(/\r\n/g, '\n').split('\n').filter(Boolean).slice(0, 5).join('\n') + '\n...'
      : 'Not available';

    await antiban.sendHuman(sock, jid, {
      text: [
        `🍽️ *${meal.strMeal}*`,
        ``,
        `📂 *Category:* ${meal.strCategory || 'N/A'}`,
        `🌍 *Cuisine:* ${meal.strArea || 'N/A'}`,
        ``,
        `🧂 *Ingredients:*`,
        ingredients.slice(0, 12).map(i => `  • ${i}`).join('\n'),
        ingredients.length > 12 ? `  _...and ${ingredients.length - 12} more_` : '',
        ``,
        `📋 *Instructions (first steps):*`,
        instructions,
        ``,
        `🎥 *Video:* ${meal.strYoutube || 'N/A'}`,
        ``,
        `_🐛 Tech God Bug 2026 · ${config.botName}_`,
      ].filter(l => l !== '').join('\n'),
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, {
      text: `❌ ${e.message}\n_Try: ${config.prefix}recipe pasta or ${config.prefix}recipe beef_`,
    }, { quoted: msg });
  }
};
