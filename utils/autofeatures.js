/**
 * 🐛 Tech God Bug 2026 — Auto Features
 * Auto-react, auto-status view, etc.
 * By Dev-Ntando
 */
'use strict';

const REACT_TRIGGERS = [
  { words: ['thanks', 'thank you', 'thx'],    emoji: '🙏' },
  { words: ['lol', 'lmao', 'haha', '😂'],      emoji: '😂' },
  { words: ['love', '❤️', '💕', 'love you'],    emoji: '❤️' },
  { words: ['fire', '🔥', 'lit'],               emoji: '🔥' },
  { words: ['sad', '😢', 'crying'],             emoji: '😢' },
  { words: ['wow', 'amazing', 'insane'],        emoji: '🤯' },
];

async function maybeReact(sock, msg, text) {
  const lower = text.toLowerCase();
  for (const trigger of REACT_TRIGGERS) {
    if (trigger.words.some(w => lower.includes(w))) {
      if (Math.random() < 0.3) { // 30% chance to react
        try {
          await sock.sendMessage(msg.key.remoteJid, {
            react: { text: trigger.emoji, key: msg.key },
          });
        } catch {}
      }
      return;
    }
  }
}

module.exports = { maybeReact };
