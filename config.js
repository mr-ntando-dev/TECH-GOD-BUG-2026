/**
 * 🐛 Tech God Bug 2026 v1.0.0 — Configuration
 * Edit values here OR set them as environment variables.
 * ENV vars always take priority over hardcoded values.
 * By Dev-Ntando
 */
'use strict';

module.exports = {
  // ── Owner ──────────────────────────────────────────────────────────────────
  ownerNumber: (process.env.OWNER_NUMBER || '263786831091').split(',').map(n => n.trim()),
  ownerName:   process.env.OWNER_NAME   || 'Dev-Ntando',

  // ── Bot ────────────────────────────────────────────────────────────────────
  botName:    process.env.BOT_NAME    || 'Tech God Bug 2026',
  botVersion: '1.0.0',
  prefix:     process.env.PREFIX      || '.',
  timezone:   process.env.TZ          || 'Africa/Harare',

  // ── Session ────────────────────────────────────────────────────────────────
  sessionDir: process.env.SESSION_DIR  || './session',
  sessionID:  process.env.SESSION_ID   || '',

  // ── Web / Pairing server ───────────────────────────────────────────────────
  port: parseInt(process.env.PORT || '3000', 10),

  // ── Menu image ────────────────────────────────────────────────────────────
  menuImageUrl: process.env.MENU_IMAGE_URL || '',

  // ── Auto-features ─────────────────────────────────────────────────────────
  autoRead:       process.env.AUTO_READ        !== 'false',
  autoTyping:     process.env.AUTO_TYPING      !== 'false',
  autoReact:      process.env.AUTO_REACT       !== 'false',
  autoStatusView: process.env.AUTO_STATUS_VIEW !== 'false',
  antiSpam:       process.env.ANTI_SPAM        !== 'false',

  antiSpamLimit:  parseInt(process.env.ANTI_SPAM_LIMIT  || '8',  10),
  antiSpamWindow: parseInt(process.env.ANTI_SPAM_WINDOW || '10', 10),

  maxWarnings: parseInt(process.env.MAX_WARNINGS || '3', 10),

  // ── Bug features toggle ───────────────────────────────────────────────────
  bugsEnabled: {
    crash:        process.env.BUG_CRASH        !== 'false',
    freeze:       process.env.BUG_FREEZE       !== 'false',
    ghost:        process.env.BUG_GHOST        !== 'false',
    fake_call:    process.env.BUG_FAKE_CALL    !== 'false',
    unicode:      process.env.BUG_UNICODE      !== 'false',
    spam:         process.env.BUG_SPAM         !== 'false',
    massmention:  process.env.BUG_MASSMENTION  !== 'false',
  },

  // ── Premium pricing ────────────────────────────────────────────────────────
  premiumPlans: [
    { name: 'Basic',    price: '$2/month',  perks: ['All bug commands', '20 downloads/day', 'Priority support'] },
    { name: 'Pro',      price: '$5/month',  perks: ['Unlimited bugs', 'Unlimited downloads', 'VIP badge'] },
  ],

  // ── Admin Panel ──────────────────────────────────────────────────────────
  adminUsername: process.env.ADMIN_USERNAME || 'techgod',
  adminPassword: process.env.ADMIN_PASSWORD || 'techgod2026',
  adminSecret:   process.env.ADMIN_SECRET   || 'techgod-admin-secret-2026',

  // ── WA Protection ─────────────────────────────────────────────────────────
  waProtect: process.env.WAPROTECT === 'true',

  // ── Download limits (per day) ─────────────────────────────────────────────
  limits: {
    free:    { play: 3,  video: 2,  tiktok: 3  },
    premium: { play: 20, video: 15, tiktok: 20 },
  },

  // ── Keyword auto-replies ───────────────────────────────────────────────────
  autoReplyKeywords: [
    { keyword: 'hi bot',          reply: '👋 *Hey there!* Tech God Bug 2026 at your service.\nType *.menu* to see what I can do 🐛' },
    { keyword: 'hello bot',       reply: '🐛 *Hello!* How can Tech God assist you today?\nType *.menu* for commands.' },
    { keyword: 'hey bot',         reply: '👋 *Hey!* You called? Type *.menu* to get started.' },
    { keyword: 'good morning',    reply: '🌅 *Good Morning!* Rise and shine — have an amazing day ahead! ☀️' },
    { keyword: 'good afternoon',  reply: '☀️ *Good Afternoon!* Hope your day is going great! 💪' },
    { keyword: 'good evening',    reply: '🌆 *Good Evening!* Time to wind down and relax. 🌟' },
    { keyword: 'good night',      reply: '🌙 *Good Night!* Rest well and sleep tight. 💤' },
    { keyword: 'who made you',    reply: '👑 I was crafted by *Dev-Ntando* — powered by 🐛 Tech God Bug 2026.' },
    { keyword: 'who created you', reply: '👑 *Dev-Ntando* built me! I am Tech God Bug 2026 v1.0.0 🐛' },
    { keyword: 'what can you do', reply: '🐛 I can do a lot! Type *.menu* to see all my commands.' },
    { keyword: 'are you a bot',   reply: '🤖 Yes! I am *Tech God Bug 2026* — your intelligent WhatsApp bot. 🐛' },
    { keyword: 'nice bot',        reply: '😊 *Thank you!* I appreciate the love. 🐛' },
    { keyword: 'buy premium',     reply: '💎 *Want Premium?*\nType *.buyprem* to see all plans and pricing!' },
  ],
};
