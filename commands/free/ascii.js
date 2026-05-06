/**
 * 🐛 Tech God Bug 2026 — ASCII Art Command
 * Converts text to block ASCII art letters.
 * By Dev-Ntando
 */
'use strict';

const config  = require('../../config');
const antiban = require('../../utils/antiban');

// Simple block-letter map using fullwidth characters
function toBlockText(text) {
  return text
    .toUpperCase()
    .split('')
    .map(c => {
      const code = c.codePointAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(code + 65248); // A-Z → ｆｕｌｌｗｉｄｔｈ
      if (code >= 48 && code <= 57) return String.fromCodePoint(code + 65248); // 0-9
      if (c === ' ') return '　'; // fullwidth space
      return c;
    })
    .join('');
}

// Alternative: big text using combining chars
function toBigBold(text) {
  const map = {
    'A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝',
    'K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧',
    'U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭',
    'a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷',
    'k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝘀','t':'𝘁',
    'u':'𝘂','v':'𝘃','w':'𝘄','x':'𝘅','y':'𝘆','z':'𝘇',
    '0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵',
    ' ':' ',
  };
  return text.split('').map(c => map[c] || c).join('');
}

function toItalic(text) {
  const map = {
    'A':'𝘈','B':'𝘉','C':'𝘊','D':'𝘋','E':'𝘌','F':'𝘍','G':'𝘎','H':'𝘏','I':'𝘐','J':'𝘑',
    'K':'𝘒','L':'𝘓','M':'𝘔','N':'𝘕','O':'𝘖','P':'𝘗','Q':'𝘘','R':'𝘙','S':'𝘚','T':'𝘛',
    'U':'𝘜','V':'𝘝','W':'𝘞','X':'𝘟','Y':'𝘠','Z':'𝘡',
    'a':'𝘢','b':'𝘣','c':'𝘤','d':'𝘥','e':'𝘦','f':'𝘧','g':'𝘨','h':'𝘩','i':'𝘪','j':'𝘫',
    'k':'𝘬','l':'𝘭','m':'𝘮','n':'𝘯','o':'𝘰','p':'𝘱','q':'𝘲','r':'𝘳','s':'𝘴','t':'𝘵',
    'u':'𝘶','v':'𝘷','w':'𝘸','x':'𝘹','y':'𝘺','z':'𝘻',
    ' ':' ',
  };
  return text.split('').map(c => map[c] || c).join('');
}

module.exports = async (sock, msg, args, { jid }) => {
  const style = args[0]?.toLowerCase();
  const validStyles = ['block', 'bold', 'italic', 'wide'];

  const text = validStyles.includes(style) ? args.slice(1).join(' ').trim() : args.join(' ').trim();
  const actualStyle = validStyles.includes(style) ? style : 'bold';

  if (!text) {
    return antiban.sendHuman(sock, jid, {
      text: `🔤 *ASCII / Styled Text*\n\n*Usage:* ${config.prefix}ascii [style] <text>\n*Styles:* bold, italic, wide, block\n\n*Examples:*\n  ${config.prefix}ascii TECH GOD\n  ${config.prefix}ascii bold Hello\n  ${config.prefix}ascii wide Big Boss`,
    }, { quoted: msg });
  }

  let result;
  switch (actualStyle) {
    case 'italic': result = toItalic(text); break;
    case 'wide':   result = toBlockText(text); break;
    case 'block':  result = toBlockText(text); break;
    default:       result = toBigBold(text);
  }

  await antiban.sendHuman(sock, jid, {
    text: `🔤 *Styled Text [${actualStyle}]:*\n\n${result}\n\n_🐛 Tech God Bug 2026_`,
  }, { quoted: msg });
};
