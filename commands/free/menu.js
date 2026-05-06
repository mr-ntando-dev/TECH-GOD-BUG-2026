/**
 * 🐛 Tech God Bug 2026 v2.5.0.5.7 — Menu Command
 * Styled menu with sub-menus for different categories.
 * By Dev-Ntando
 */
'use strict';

const fs     = require('fs');
const path   = require('path');
const config = require('../../config');
const antiban = require('../../utils/antiban');

function greeting() {
  const h = new Date(new Date().toLocaleString('en-US', { timeZone: config.timezone })).getHours();
  if (h >= 5  && h < 12) return '🌅 Good Morning';
  if (h >= 12 && h < 17) return '☀️ Good Afternoon';
  if (h >= 17 && h < 21) return '🌆 Good Evening';
  return '🌙 Good Night';
}

const T  = '╔' + '═'.repeat(34) + '╗';
const B  = '╚' + '═'.repeat(34) + '╝';
const TM = '╠' + '═'.repeat(34) + '╣';
const V  = '║';
const SL = '·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─·─';
const DS = '══════════════════════════════════';

const sec = (icon, name) => `\n${icon} *〔 ${name} 〕*\n${SL}`;
const row = (P, main, alias, desc) =>
  `  ❯ *${P}${main}*${alias ? `  _[${alias}]_` : ''}${desc ? `\n     ↳ _${desc}_` : ''}`;

module.exports = async (sock, msg, args, { isOwner, sender, jid }) => {
  const P   = config.prefix;
  const sub = (args[0] || '').toLowerCase();
  const up  = process.uptime();
  const upStr = `${Math.floor(up/3600)}h ${Math.floor((up%3600)/60)}m ${Math.floor(up%60)}s`;
  const now = new Date().toLocaleString('en-ZA', {
    timeZone: config.timezone, weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  const fakeQuote = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: {
      contactMessage: {
        displayName: config.botName,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${config.botName}\nORG:🐛 Tech God Bug 2026;\nTEL;type=CELL;type=VOICE;waid=${config.ownerNumber[0]}:+${config.ownerNumber[0]}\nEND:VCARD`,
      },
    },
  };

  // ── Sub-menus ──────────────────────────────────────────────────────────────
  if (sub === 'bugs' || sub === 'bug') {
    return antiban.sendHuman(sock, jid, { text: [
      T, `${V}  🐛  *B U G   C O M M A N D S*`, `${V}  🔥 ${config.botName} v${config.botVersion}`, B, '',
      `  💣 *〔 PRANK BUGS 〕*`, SL,
      row(P, 'crash @user',       'crash',         'Send heavy Unicode to lag their WA'),
      row(P, 'freeze @user',      'blank',         'Push their chat off screen'),
      row(P, 'ghost @user',       'ghost',         'Send invisible empty message'),
      row(P, 'fakecall @user',    'fakecall',      'Fake incoming/missed call'),
      row(P, 'unicode @user',     'unicode',       'RTL/Unicode rendering chaos'),
      row(P, 'spam @user [n]',    'spam',          'Spam repeated messages'),
      row(P, 'massmention [n]',   'massmention',   'Tag everyone rapidly (groups)'),
      '', SL,
      `  🆕 *〔 NEW BUG COMMANDS 〕*`, SL,
      row(P, 'matrix @user',      'matrix',        'Cascade matrix characters'),
      row(P, 'bigtext @user [txt]','bigtext',       'Wall of big text'),
      row(P, 'flashbomb @user',   'flash',         'Rapid black/white flashes'),
      row(P, 'emojibomb @user',   'eb',            'Emoji wave flood'),
      row(P, 'glitch @user',      'glitch',        'Zalgo/glitched corrupt text'),
      row(P, 'loopquote @user',   'lq',            'Nested loop quote chain'),
      '', DS,
      `_⚠️ Use responsibly! Educational/prank use only._`,
      `_← ${P}menu  ·  ${P}menu ai  ·  ${P}menu dl_`,
    ].join('\n') }, { quoted: msg });
  }

  if (sub === 'ai') {
    return antiban.sendHuman(sock, jid, { text: [
      T, `${V}  🤖  *A I   C O M M A N D S*`, `${V}  🐛 ${config.botName} v${config.botVersion}`, B, '',
      `  🧠 *〔 CHAT AI 〕*`, SL,
      row(P, 'ask <question>',   'ai · chat · gpt', 'Ask Tech God AI anything'),
      '',
      `  🎨 *〔 IMAGE AI 〕*`, SL,
      row(P, 'imagine <prompt>', 'img',              'Generate AI image from text'),
      '',
      `  🎙️ *〔 VOICE AI 〕*`, SL,
      row(P, 'tts <text>',       'voice',            'Convert text to voice note'),
      '',
      `  📝 *〔 OTHER AI 〕*`, SL,
      row(P, 'caption',          'caption',          'AI describes a sent image'),
      row(P, 'summarize <text>', 'tldr',             'Summarize long text'),
      row(P, 'roast @user',      'roast',            'AI roasts a tagged person'),
      '', SL,
      `  🆕 *〔 NEW AI COMMANDS 〕*`, SL,
      row(P, 'rizz [name]',      'pickup',           'AI rizz / pickup line'),
      row(P, 'story <prompt>',   'story',            'AI writes a short story'),
      row(P, 'rap <topic>',      'bars',             'AI spits rap bars'),
      row(P, 'haiku [topic]',    'haiku',            'AI haiku poem (5-7-5)'),
      row(P, 'motivate [@user]', 'hype',             'AI motivational speech'),
      row(P, 'debate <topic>',   'debate',           'AI argues both sides'),
      '', DS,
      `_← ${P}menu  ·  ${P}menu bugs  ·  ${P}menu dl_`,
    ].join('\n') }, { quoted: msg });
  }

  if (sub === 'dl' || sub === 'downloads') {
    return antiban.sendHuman(sock, jid, { text: [
      T, `${V}  📥  *D O W N L O A D S*`, `${V}  🐛 ${config.botName} v${config.botVersion}`, B, '',
      row(P, 'tiktok <url>',     'tt · ttdl',        'TikTok no-watermark video'),
      row(P, 'song <name/url>',  'play · ytmp3',     'YouTube audio MP3'),
      row(P, 'video <name/url>', 'ytmp4 · ytvideo',  'YouTube video MP4'),
      row(P, 'ig <url>',         'insta · reels',    'Instagram reels/posts'),
      row(P, 'fb <url>',         'fbdl · facebook',  'Facebook video'),
      row(P, 'pin <url>',        'pindl · pinterest','Pinterest images'),
      '', SL,
      `  🆕 *〔 NEW DOWNLOADS 〕*`, SL,
      row(P, 'twitter <url>',    'xdl · twdl',    'Twitter/X video download'),
      row(P, 'spotify <song>',   'spdl',          'Spotify track info + YT link'),
      row(P, 'reddit <url>',     'rdl',           'Reddit post media'),
      '', DS,
      `_← ${P}menu  ·  ${P}menu bugs  ·  ${P}menu tools_`,
    ].join('\n') }, { quoted: msg });
  }

  if (sub === 'tools' || sub === 'fun') {
    return antiban.sendHuman(sock, jid, { text: [
      T, `${V}  🔧  *T O O L S  &  F U N*`, `${V}  🐛 ${config.botName} v${config.botVersion}`, B, '',
      row(P, 'ping',            '',              'Bot latency check'),
      row(P, 'weather <city>',  'weather',       'Current weather info'),
      row(P, 'translate <text>','tr',            'Translate text'),
      row(P, 'define <word>',   'define',        'Dictionary lookup'),
      row(P, 'calc <expr>',     'calc',          'Calculate math'),
      row(P, 'qr <text>',       'qr',            'Generate QR code'),
      row(P, 'sticker',         's',             'Convert image to sticker'),
      row(P, 'toimage',         'toimage',       'Convert sticker to image'),
      row(P, 'joke',            'joke',          'Random joke'),
      row(P, 'fact',            'fact',          'Random fact'),
      row(P, 'quote',           'quote',         'Random motivational quote'),
      row(P, 'toss',            'toss',          'Flip a coin'),
      row(P, '8ball <question>','eightball',     'Magic 8-ball'),
      row(P, 'dice',            'dice',          'Roll a dice'),
      row(P, 'password [len]',  'password',      'Generate random password'),
      row(P, 'aesthetic <text>','aesthetic',      'Aesthetic text styling'),
      row(P, 'reverse <text>',  'reverse',       'Reverse text'),
      '', SL,
      `  🆕 *〔 NEW COMMANDS 〕*`, SL,
      row(P, 'rizz [name]',     'pickup',        'AI rizz / pickup line'),
      row(P, 'story <prompt>',  'story',         'AI short story'),
      row(P, 'rap <topic>',     'bars',          'AI rap verse'),
      row(P, 'haiku [topic]',   'haiku',         'AI haiku poem'),
      row(P, 'motivate [@user]','hype',          'AI motivational speech'),
      row(P, 'choose a,b,c...',  'pick',         'Let Bug decide'),
      row(P, 'debate <topic>',  'debate',        'AI argues both sides'),
      row(P, 'poll Q|A|B|C',    'poll',          'Create a group poll'),
      row(P, 'ascii [style] txt','styled',       'Bold/italic styled text'),
      row(P, 'countdown <date>','timer',         'Countdown to a date'),
      row(P, 'bmi <kg> <cm>',   'bmi',           'Body mass index calc'),
      row(P, 'rate <anything>', 'rate',          'Bug rates it /10'),
      row(P, 'encode encode txt','decode',       'Base64 encode/decode'),
      '', DS,
      `_← ${P}menu  ·  ${P}menu bugs  ·  ${P}menu group_`,
    ].join('\n') }, { quoted: msg });
  }

  if (sub === 'group') {
    return antiban.sendHuman(sock, jid, { text: [
      T, `${V}  👥  *G R O U P   C M D S*`, `${V}  🐛 ${config.botName} v${config.botVersion}`, B, '',
      row(P, 'antilink on/off', 'antilink',      'Toggle anti-link'),
      row(P, 'antiword <word>', 'antiword',      'Block words in group'),
      row(P, 'welcome on/off',  'welcome',       'Toggle welcome messages'),
      row(P, 'kick @user',      'kick',          'Remove member'),
      row(P, 'promote @user',   'promote',       'Make admin'),
      row(P, 'demote @user',    'demote',        'Remove admin'),
      row(P, 'mute / unmute',   'mute',          'Mute/unmute group'),
      row(P, 'tagall',          'everyone · tag','Tag all members'),
      row(P, 'groupinfo',       'groupinfo',     'Show group info'),
      row(P, 'rules',           'setrules',      'Set/view group rules'),
      row(P, 'warn @user',      'warn',          'Warn a member'),
      '', SL,
      `  🆕 *〔 NEW GROUP COMMANDS 〕*`, SL,
      row(P, 'lock / unlock',   'lock',          'Lock group (admins only)'),
      row(P, 'invitelink',      'invite',        'Get group invite link'),
      row(P, 'resetlink',       'revoke',        'Revoke & regenerate link'),
      row(P, 'listadmins',      'admins',        'List all group admins'),
      row(P, 'setdesc <text>',  'setdescription','Update group description'),
      row(P, 'groupstats',      'members',       'Group member statistics'),
      '', DS,
      `_← ${P}menu  ·  ${P}menu bugs  ·  ${P}menu owner_`,
    ].join('\n') }, { quoted: msg });
  }

  if (sub === 'owner') {
    return antiban.sendHuman(sock, jid, { text: [
      T, `${V}  👑  *O W N E R   C M D S*`, `${V}  🐛 ${config.botName} v${config.botVersion}`, B, '',
      row(P, 'pair',            'pair',          'Generate pairing code'),
      row(P, 'broadcast <msg>', 'broadcast',     'Broadcast to all chats'),
      row(P, 'shutdown',        'shutdown',      'Shut down the bot'),
      row(P, 'setname <name>',  'setname',       'Change bot display name'),
      row(P, 'botstats',        'botstats',      'View bot statistics'),
      row(P, 'ban @user',       'ban',           'Ban user from bot'),
      row(P, 'unban @user',     'unban',         'Unban user'),
      row(P, 'addpremium @user','addpremium',    'Give premium access'),
      row(P, 'rmpremium @user', 'rmpremium',     'Remove premium access'),
      '', SL,
      `  🆕 *〔 NEW OWNER COMMANDS 〕*`, SL,
      row(P, 'restart',         'reboot',        'Restart the bot'),
      row(P, 'clearcache',      'cc',            'Clear cache & reset stats'),
      row(P, 'announce <msg>',  'announce',      'Styled announcement'),
      row(P, 'setprefix <x>',   'setprefix',     'Change command prefix'),
      row(P, 'sysinfo',         'system',        'View server resource usage'),
      '', DS,
      `_← ${P}menu  ·  ${P}menu bugs_`,
    ].join('\n') }, { quoted: msg });
  }

  if (sub === 'search') {
    return antiban.sendHuman(sock, jid, { text: [
      T, `${V}  🔍  *S E A R C H   C M D S*`, `${V}  🐛 ${config.botName} v${config.botVersion}`, B, '',
      row(P, 'wiki <query>',    'wiki',          'Wikipedia search'),
      row(P, 'lyrics <song>',   'lyrics',        'Song lyrics search'),
      row(P, 'movie <name>',    'movie',         'Movie info lookup'),
      row(P, 'news',            'news',          'Latest news'),
      row(P, 'gif <query>',     'gif',           'Search for GIFs'),
      row(P, 'ytsearch <query>','ytsearch',      'YouTube video search'),
      '', SL,
      `  🆕 *〔 NEW SEARCH COMMANDS 〕*`, SL,
      row(P, 'crypto <coin>',   'price · btc',   'Live crypto price (CoinGecko)'),
      row(P, 'recipe <food>',   'food',          'Find a recipe (MealDB)'),
      row(P, 'anime <title>',   'anime',         'Anime info (MyAnimeList)'),
      row(P, 'github user/repo','gh',            'GitHub profile or repo info'),
      row(P, 'npm <package>',   'pkg',           'npm package info'),
      '', DS,
      `_← ${P}menu  ·  ${P}menu bugs  ·  ${P}menu dl_`,
    ].join('\n') }, { quoted: msg });
  }

  // ── Main menu ──────────────────────────────────────────────────────────────
  const mainMenu = [
    T,
    `${V}  🐛  *T E C H  G O D  B U G*`,
    `${V}  *2 0 2 6*  ·  v${config.botVersion}`,
    `${V}  ${greeting()}`,
    B,
    '',
    `  👤 *User:* @${sender.split('@')[0].split(':')[0]}`,
    `  📅 *Date:* ${now}`,
    `  ⏱️ *Uptime:* ${upStr}`,
    `  🐛 *Prefix:* [ ${P} ]`,
    '',
    TM,
    '',
    sec('🐛', 'BUG COMMANDS'),
    `  ❯ *${P}menu bugs*  ↳ _Crash, Freeze, Ghost, Spam..._`,
    '',
    sec('🤖', 'AI COMMANDS'),
    `  ❯ *${P}menu ai*  ↳ _Chat AI, Image AI, Voice AI..._`,
    '',
    sec('📥', 'DOWNLOADS'),
    `  ❯ *${P}menu dl*  ↳ _TikTok, YouTube, Instagram..._`,
    '',
    sec('🔧', 'TOOLS & FUN'),
    `  ❯ *${P}menu tools*  ↳ _Weather, Sticker, Jokes..._`,
    '',
    sec('🔍', 'SEARCH'),
    `  ❯ *${P}menu search*  ↳ _Wiki, Lyrics, Movies..._`,
    '',
    sec('👥', 'GROUP'),
    `  ❯ *${P}menu group*  ↳ _AntiLink, Kick, Warn..._`,
    '',
    sec('👑', 'OWNER'),
    `  ❯ *${P}menu owner*  ↳ _Pair, Broadcast, Ban..._`,
    '',
    DS,
    `_🐛 Tech God Bug 2026 · By Dev-Ntando_`,
    `_Type ${P}menu <category> for detailed commands_`,
  ].join('\n');

  // Send with menu image if available
  const imgPath = path.join(__dirname, '../../assets/menu_image.jpg');
  if (config.menuImageUrl) {
    await antiban.sendHuman(sock, jid, {
      image: { url: config.menuImageUrl },
      caption: mainMenu,
      mentions: [sender],
    }, { quoted: fakeQuote });
  } else if (fs.existsSync(imgPath)) {
    await antiban.sendHuman(sock, jid, {
      image: fs.readFileSync(imgPath),
      caption: mainMenu,
      mentions: [sender],
    }, { quoted: fakeQuote });
  } else {
    await antiban.sendHuman(sock, jid, { text: mainMenu, mentions: [sender] }, { quoted: fakeQuote });
  }
};
