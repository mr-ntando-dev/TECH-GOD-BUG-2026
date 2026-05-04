# 🐛 Tech God Bug 2026

> Multi-User WhatsApp Bot with Bug/Prank Commands • By Dev-Ntando

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## ⚡ Features

### 🐛 Bug/Prank Commands (Signature Feature)
- `.crash` — Send heavy Unicode to lag older WhatsApp builds
- `.freeze` — Push chat off screen with long blank messages
- `.ghost` — Send invisible zero-width messages
- `.fakecall` — Send fake incoming/missed call messages
- `.unicode` — RTL/Unicode rendering chaos
- `.spam` — Rapid message spam
- `.massmention` — Tag everyone rapidly (groups)

### 🤖 AI Commands
- `.ask` / `.ai` / `.chat` / `.gpt` — Chat with Bug AI
- `.imagine` — AI image generation
- `.tts` / `.voice` — Text to speech
- `.roast` — AI roasts a user
- `.summarize` / `.tldr` — Summarize text

### 📥 Downloads
- `.tiktok` — TikTok no-watermark download
- `.song` / `.play` — YouTube MP3
- `.video` / `.ytmp4` — YouTube MP4
- `.ig` / `.insta` — Instagram reels/posts
- `.fb` — Facebook video
- `.pin` — Pinterest images

### 🔧 Tools & Fun
- `.ping`, `.weather`, `.translate`, `.define`, `.calc`, `.qr`
- `.sticker`, `.joke`, `.fact`, `.quote`, `.toss`, `.8ball`
- `.dice`, `.password`, `.aesthetic`, `.reverse`

### 👥 Group Management
- `.antilink`, `.antiword`, `.welcome`, `.kick`, `.mute`
- `.tagall`, `.promote`, `.demote`, `.warn`, `.rules`

### 👑 Owner Commands
- `.pair`, `.broadcast`, `.shutdown`, `.ban`, `.unban`
- `.addpremium`, `.rmpremium`, `.botstats`, `.setname`

### 🔍 Search
- `.wiki`, `.lyrics`, `.movie`, `.news`, `.gif`, `.ytsearch`

---

## 🚀 Deployment

### One-Click Deploy (Render)
1. Fork this repo
2. Click the Deploy to Render button above
3. Set your `OWNER_NUMBER` environment variable
4. Once deployed, visit the dashboard and use `/pair` to connect your WhatsApp

### Manual Deploy
```bash
git clone https://github.com/mr-ntando-dev/TECH-GOD-BUG-2026.git
cd TECH-GOD-BUG-2026
npm install
cp .env.example .env
# Edit .env with your settings
node index.js
```

---

## ⚙️ Configuration

All settings can be configured via environment variables or by editing `config.js`.

| Variable | Default | Description |
|----------|---------|-------------|
| `OWNER_NUMBER` | `263786831091` | Your WhatsApp number |
| `BOT_NAME` | `Tech God Bug 2026` | Bot display name |
| `PREFIX` | `.` | Command prefix |
| `PORT` | `3000` | Web server port |
| `TZ` | `Africa/Harare` | Timezone |

---

## 📊 Architecture

```
tech-god-bug-2026/
├── index.js           # Entry point
├── config.js          # Configuration
├── handler.js         # Message router
├── database.js        # JSON flat-file database
├── sessionManager.js  # Multi-user session manager
├── server.js          # Express web server + dashboard
├── commands/
│   ├── bugs/          # 🐛 Bug/prank commands
│   ├── free/          # 🔧 General commands
│   ├── downloads/     # 📥 Media downloaders
│   ├── group/         # 👥 Group management
│   ├── owner/         # 👑 Owner-only commands
│   └── search/        # 🔍 Search commands
├── utils/
│   ├── antiban.js     # Human-like behaviour engine
│   ├── api.js         # API call helpers
│   ├── autoDownload.js
│   ├── autofeatures.js
│   ├── autoprotect.js
│   ├── session.js
│   └── waprotect.js
└── assets/            # Static assets
```

---

## ⚠️ Disclaimer

The bug/prank commands are for **educational and consensual prank use only**. Abusing these features may violate WhatsApp Terms of Service. Use responsibly.

---

## 👑 Credits

**Dev-Ntando** — Creator & Developer

---

*🐛 Tech God Bug 2026 — Your Bot. Your Rules.*
