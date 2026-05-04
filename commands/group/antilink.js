/**
 * 🐛 Tech God Bug 2026 — Anti-Link
 * By Dev-Ntando
 */
'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');
const db      = require('../../database');

async function check(sock, msg, jid, sender, text) {
  const group = db.getGroup(jid);
  if (!group.antilink) return false;

  const isOwner = config.ownerNumber.includes(sender.split('@')[0].split(':')[0]);
  if (isOwner) return false;

  // Check if sender is admin
  try {
    const meta = await sock.groupMetadata(jid);
    const isAdmin = meta.participants.find(p => p.id === sender)?.admin;
    if (isAdmin) return false;
  } catch {}

  const linkRegex = /https?:\/\/[^\s]+/i;
  if (linkRegex.test(text)) {
    await sock.sendMessage(jid, { delete: msg.key });
    await antiban.sendHuman(sock, jid, { text: `⚠️ @${sender.split('@')[0]}, links are not allowed in this group!`, mentions: [sender] });
    return true;
  }
  return false;
}

async function handler(sock, msg, args, { jid, isOwner, isGroup }) {
  if (!isGroup) return antiban.sendHuman(sock, jid, { text: '❌ This command only works in groups.' }, { quoted: msg });

  const action = (args[0] || '').toLowerCase();
  if (action === 'on') {
    db.setGroup(jid, { antilink: true });
    await antiban.sendHuman(sock, jid, { text: '🔗 *Anti-Link enabled!*\n_Links will be auto-deleted._' }, { quoted: msg });
  } else if (action === 'off') {
    db.setGroup(jid, { antilink: false });
    await antiban.sendHuman(sock, jid, { text: '🔗 *Anti-Link disabled!*' }, { quoted: msg });
  } else {
    await antiban.sendHuman(sock, jid, { text: `🔗 *Anti-Link*\n\n*Usage:* ${config.prefix}antilink on/off` }, { quoted: msg });
  }
}

handler.check = check;
module.exports = handler;
