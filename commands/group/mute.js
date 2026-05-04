'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid, isGroup }) => {
  if (!isGroup) return antiban.sendHuman(sock, jid, { text: '❌ Groups only.' }, { quoted: msg });
  const cmd = msg.message?.conversation?.split(' ')[0]?.slice(1) || 'mute';
  try {
    if (cmd === 'unmute') {
      await sock.groupSettingUpdate(jid, 'not_announcement');
      await antiban.sendHuman(sock, jid, { text: '🔊 *Group unmuted!*' }, { quoted: msg });
    } else {
      await sock.groupSettingUpdate(jid, 'announcement');
      await antiban.sendHuman(sock, jid, { text: '🔇 *Group muted!* Only admins can send messages.' }, { quoted: msg });
    }
  } catch (e) {
    await antiban.sendHuman(sock, jid, { text: `❌ Failed: ${e.message}` }, { quoted: msg });
  }
};
