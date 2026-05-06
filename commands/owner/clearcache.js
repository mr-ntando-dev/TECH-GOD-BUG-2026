/**
 * 🐛 Tech God Bug 2026 — Clear Cache Command
 * Owner only: clears the in-memory stats cache and resets daily counters.
 * By Dev-Ntando
 */
'use strict';

const antiban = require('../../utils/antiban');
const db      = require('../../database');
const config  = require('../../config');

module.exports = async (sock, msg, args, { isOwner, jid }) => {
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Owner only command.' }, { quoted: msg });
  }

  try {
    // Reset daily stats if db supports it
    if (typeof db.resetDailyStats === 'function') {
      db.resetDailyStats();
    }

    // Force GC if available
    if (global.gc) global.gc();

    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    await antiban.sendHuman(sock, jid, {
      text: [
        `🧹 *Cache Cleared!*`,
        ``,
        `✅ Daily stats reset`,
        `✅ Memory freed`,
        ``,
        `📊 *Current Heap:* ${memUsed} MB`,
        ``,
        `_🐛 ${config.botName} is running clean._`,
      ].join('\n'),
    }, { quoted: msg });
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed: ${e.message}` }, { quoted: msg });
  }
};
