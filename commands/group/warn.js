'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');
const db      = require('../../database');
module.exports = async (sock, msg, args, { jid, isGroup, sender }) => {
  if (!isGroup) return antiban.sendHuman(sock, jid, { text: '❌ Groups only.' }, { quoted: msg });
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const cmd = (msg.message?.conversation || '').split(' ')[0]?.slice(1) || 'warn';

  const group = db.getGroup(jid);
  group.warnings = group.warnings || {};

  if (cmd === 'resetwarn' || cmd === 'clearwarn') {
    if (mentioned[0]) { group.warnings[mentioned[0]] = 0; }
    else { group.warnings = {}; }
    db.setGroup(jid, group);
    return antiban.sendHuman(sock, jid, { text: '✅ Warnings reset.' }, { quoted: msg });
  }
  if (cmd === 'warnings') {
    const target = mentioned[0] || sender;
    const count = group.warnings[target] || 0;
    return antiban.sendHuman(sock, jid, { text: `⚠️ @${target.split('@')[0]} has *${count}/${config.maxWarnings}* warnings.`, mentions: [target] }, { quoted: msg });
  }
  // warn
  if (!mentioned.length) return antiban.sendHuman(sock, jid, { text: `⚠️ *Usage:* ${config.prefix}warn @user` }, { quoted: msg });
  const target = mentioned[0];
  group.warnings[target] = (group.warnings[target] || 0) + 1;
  db.setGroup(jid, group);
  const count = group.warnings[target];
  if (count >= config.maxWarnings) {
    try {
      await sock.groupParticipantsUpdate(jid, [target], 'remove');
      await antiban.sendHuman(sock, jid, { text: `👢 @${target.split('@')[0]} reached ${config.maxWarnings} warnings and was kicked!`, mentions: [target] }, { quoted: msg });
    } catch {}
  } else {
    await antiban.sendHuman(sock, jid, { text: `⚠️ @${target.split('@')[0]} warned! (${count}/${config.maxWarnings})`, mentions: [target] }, { quoted: msg });
  }
};
