/**
 * 🐛 Tech God Bug 2026 v2.5.0.5.7 — Multi-User Entry Point
 *
 * Each WhatsApp number gets its own isolated bot instance.
 * The server dashboard shows all running bots (phone numbers masked).
 * Only the admin panel can delete/disconnect sessions.
 *
 * By Dev-Ntando
 */
'use strict';

process.env.PUPPETEER_SKIP_DOWNLOAD          = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

// ── Suppress Baileys crypto noise ─────────────────────────────────────────────
const SUPPRESS = [
  'sessionentry','prekey','ratchet','_chains','signal protocol',
  'chainkey','currentratchet','registrationid','closing session',
  'basekeypair','remoteid','pendingprekey','ephemeralkeypair',
  'rootkey','indexinfo',
];
const _orig = { log: console.log, error: console.error, warn: console.warn };
const _hide = function() {
  const a = Array.prototype.slice.call(arguments);
  return a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ')
    .toLowerCase().match(new RegExp(SUPPRESS.join('|')));
};
console.log   = function() { if (!_hide.apply(null, arguments)) _orig.log.apply(_orig, arguments); };
console.error = function() { if (!_hide.apply(null, arguments)) _orig.error.apply(_orig, arguments); };
console.warn  = function() { if (!_hide.apply(null, arguments)) _orig.warn.apply(_orig, arguments); };

const config         = require('./config');
const sessionManager = require('./sessionManager');
const server         = require('./server');

_orig.log([
  '',
  '╔════════════════════════════════════════════╗',
  '  🐛  T E C H   G O D   B U G   v' + config.botVersion,
  '     Multi-User WhatsApp Bot · By Dev-Ntando',
  '╚════════════════════════════════════════════╝',
  '',
  '   🤖  Bot Name  : ' + config.botName,
  '   🐛  Prefix    : ' + config.prefix,
  '   👑  Owner     : ' + [].concat(config.ownerNumber).join(', '),
  '   🌐  Port      : ' + config.port,
  '',
  '   ⏳ Booting saved sessions...',
  '',
].join('\n'));

(async () => {
  // Start express server first so health checks pass immediately on Render
  await new Promise(resolve => {
    server.listen(config.port, () => {
      _orig.log('🌐 Web server listening on port ' + config.port);
      resolve();
    });
  });

  // Boot all previously-saved user sessions
  await sessionManager.bootSavedSessions();

  _orig.log('✅ Session manager ready — ' + sessionManager.getAllBots().length + ' bot(s) loaded');
})();
