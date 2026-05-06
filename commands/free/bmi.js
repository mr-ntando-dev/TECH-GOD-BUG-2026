/**
 * 🐛 Tech God Bug 2026 — BMI Calculator
 * Calculates Body Mass Index.
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid }) => {
  const weight = parseFloat(args[0]);
  const height = parseFloat(args[1]);

  if (!weight || !height || isNaN(weight) || isNaN(height)) {
    return antiban.sendHuman(sock, jid, {
      text: `⚖️ *BMI Calculator*\n\n*Usage:* ${config.prefix}bmi <weight kg> <height cm>\n*Example:* ${config.prefix}bmi 70 175\n\n_Weight in kilograms, height in centimetres._`,
    }, { quoted: msg });
  }

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const rounded = bmi.toFixed(1);

  let category, emoji;
  if (bmi < 18.5)        { category = 'Underweight';     emoji = '⚠️'; }
  else if (bmi < 25)     { category = 'Normal weight';   emoji = '✅'; }
  else if (bmi < 30)     { category = 'Overweight';      emoji = '⚠️'; }
  else if (bmi < 35)     { category = 'Obese (Class I)'; emoji = '🔴'; }
  else                   { category = 'Obese (Class II+)'; emoji = '🔴'; }

  await antiban.sendHuman(sock, jid, {
    text: [
      `⚖️ *BMI Result*`,
      ``,
      `📊 *BMI Score:* ${rounded}`,
      `${emoji} *Category:* ${category}`,
      ``,
      `📝 *Input:*`,
      `  ╰┈➤ Weight: ${weight} kg`,
      `  ╰┈➤ Height: ${height} cm`,
      ``,
      `_⚠️ BMI is a general indicator, not a medical diagnosis._`,
      `_🐛 Tech God Bug 2026_`,
    ].join('\n'),
  }, { quoted: msg });
};
