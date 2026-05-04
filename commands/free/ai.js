/**
 * 🐛 Tech God Bug 2026 — AI Command
 * .ask / .ai / .chat / .gpt
 * By Dev-Ntando
 */
'use strict';

const { chatAI } = require('../../utils/api');
const config     = require('../../config');
const antiban    = require('../../utils/antiban');

const TOP  = '╔══〔 🤖 〕══════════════════════╗';
const BOT  = '╚══〔 🐛 〕══════════════════════╝';
const SEP  = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
const THIN = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';

const PERSONA = `You are *Bug* 🐛, the AI brain of *${config.botName}* — a modded WhatsApp bot by Dev-Ntando. You are witty, confident, and helpful. Never say you are ChatGPT or any other AI. Always respond as Bug.`;

const THINKING = [
  '🧠 _Bug is thinking..._',
  '🐛 _Processing your query..._',
  '🔍 _Searching the matrix..._',
  '💡 _Bug is cooking something up..._',
  '🌐 _Connecting to the AI core..._',
];

const FOOTERS = [
  `🐛 *Bug AI* · ${config.botName} v${config.botVersion}`,
  `🤖 _Powered by Bug · built by Dev-Ntando_`,
  `✨ *Tech God AI* · Always online, always sharp`,
  `🌟 _Bug never sleeps_ · ${config.botName}`,
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function formatReply(query, answer, sender) {
  const senderTag = sender ? `@${sender.split('@')[0].split(':')[0]}` : 'User';
  const time = new Date().toLocaleTimeString('en-ZA', {
    timeZone: config.timezone, hour: '2-digit', minute: '2-digit', hour12: false,
  });

  const body = answer.split('\n').map(l => l.trim()).filter(Boolean).map(l => `▸ ${l}`).join('\n');

  return [
    TOP,
    `║  🤖  *B U G   A I*   ·   ${config.botName}`,
    BOT, '',
    `┌─────────────────────────────────┐`,
    `│  💬 *Question by* ${senderTag}`,
    `│  _${query}_`,
    `└─────────────────────────────────┘`,
    '', SEP, '',
    body,
    '', THIN, '',
    `🕐 _${time}_   ·   ${pick(FOOTERS)}`,
  ].join('\n');
}

module.exports = async (sock, msg, args, { sender, jid }) => {
  const query = args.join(' ').trim();

  if (!query) {
    const P = config.prefix;
    return antiban.sendHuman(sock, jid, { text: [
      TOP,
      `║  🤖  *B U G   A I*   ·   ${config.botName}`,
      BOT, '',
      `❓ *How to use Bug AI:*`, THIN,
      `  ╰┈➤ *${P}ask* _What is quantum computing?_`,
      `  ╰┈➤ *${P}ai*  _Write me a rap about coding_`,
      `  ╰┈➤ *${P}chat* _Tell me a fun story_`,
      `  ╰┈➤ *${P}gpt* _Explain black holes simply_`,
      '', `💡 _Just ask Bug anything!_`,
      '', SEP, `_🐛 Bug AI · ${config.botName}_`,
    ].join('\n') }, { quoted: msg });
  }

  // Send thinking message
  await antiban.sendHuman(sock, jid, { text: pick(THINKING) }, { quoted: msg });

  // Call AI
  const answer = await chatAI(query, PERSONA);
  const reply = formatReply(query, answer, sender);

  await antiban.sendHuman(sock, jid, { text: reply, mentions: [sender] }, { quoted: msg });
};
