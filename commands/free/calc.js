/**
 * 🐛 Tech God Bug 2026 — Calculator
 * By Dev-Ntando
 */
'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid }) => {
  const expr = args.join(' ').trim();
  if (!expr) {
    return antiban.sendHuman(sock, jid, { text: `🔢 *Usage:* ${config.prefix}calc <expression>\n*Example:* ${config.prefix}calc 2+2*3` }, { quoted: msg });
  }

  try {
    // Safe eval — only allow math characters
    if (!/^[\d\s+\-*/().%^]+$/.test(expr)) throw new Error('Invalid expression');
    const result = Function('"use strict"; return (' + expr + ')')();
    await antiban.sendHuman(sock, jid, { text: `🔢 *Calculator*\n\n📝 ${expr}\n✅ *Result:* ${result}` }, { quoted: msg });
  } catch {
    await antiban.sendHuman(sock, jid, { text: '❌ Invalid math expression.' }, { quoted: msg });
  }
};
