/**
 * 🐛 Tech God Bug 2026 — Mass Mention Bug
 * Tags everyone in a group rapidly (groups only).
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

module.exports = async (sock, msg, args, { isOwner, sender, jid, isGroup }) => {
  if (!config.bugsEnabled.massmention) {
    return antiban.sendHuman(sock, jid, { text: '❌ Mass mention bug is currently disabled.' }, { quoted: msg });
  }

  if (!isGroup) {
    return antiban.sendHuman(sock, jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
  }

  const groupMeta = await sock.groupMetadata(jid);
  const participants = groupMeta.participants.map(p => p.id);
  const rounds = Math.min(parseInt(args[0]) || 3, 10);

  await antiban.sendHuman(sock, jid, { text: `🐛 *Mass mention incoming...*\n👥 ${participants.length} members\n🔁 ${rounds} rounds` }, { quoted: msg });

  for (let r = 0; r < rounds; r++) {
    const text = participants.map(p => `@${p.split('@')[0]}`).join(' ');
    await sock.sendMessage(jid, { text, mentions: participants });
    await new Promise(r => setTimeout(r, 600));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, { text: `✅ *Mass mention done!*\n🐛 ${rounds} rounds × ${participants.length} mentions` }, { quoted: msg });
};
