/**
 * 🐛 Tech God Bug 2026 — Express Web Server
 * Provides: health check, pairing endpoint, admin panel, bot status dashboard.
 * By Dev-Ntando
 */
'use strict';

const express        = require('express');
const path           = require('path');
const config         = require('./config');
const sessionManager = require('./sessionManager');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check (for Render / Railway) ──────────────────────────────────────
app.get('/', (req, res) => {
  const bots = sessionManager.getAllBots();
  const connected = bots.filter(b => b.connected).length;
  res.json({
    bot: config.botName,
    version: config.botVersion,
    status: 'running',
    bots: { total: bots.length, connected },
    uptime: Math.floor(process.uptime()) + 's',
  });
});

app.get('/health', (req, res) => res.sendStatus(200));

// ── Pairing page (GET) ───────────────────────────────────────────────────────
app.get('/pair', (req, res) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Tech God Bug 2026 - Pair Device</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; color: #e0e0e0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 40px; max-width: 420px; width: 90%; text-align: center; }
    h1 { color: #00ff88; font-size: 1.8rem; margin-bottom: 8px; }
    p { color: #888; margin-bottom: 24px; font-size: 0.9rem; }
    input { width: 100%; padding: 14px 16px; border-radius: 8px; border: 1px solid #444; background: #0a0a0a; color: #fff; font-size: 1rem; margin-bottom: 16px; outline: none; }
    input:focus { border-color: #00ff88; }
    button { width: 100%; padding: 14px; border-radius: 8px; border: none; background: #00ff88; color: #0a0a0a; font-size: 1rem; font-weight: 700; cursor: pointer; }
    button:hover { background: #00cc6a; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .result { margin-top: 20px; padding: 16px; border-radius: 8px; font-size: 1.1rem; font-weight: bold; }
    .result.success { background: #00ff8822; color: #00ff88; }
    .result.error { background: #ff444422; color: #ff4444; }
    .code { font-size: 2rem; letter-spacing: 4px; margin-top: 8px; }
    .instructions { margin-top: 16px; color: #aaa; font-size: 0.8rem; text-align: left; }
    .instructions li { margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🐛 Pair Device</h1>
    <p>Enter your WhatsApp number (digits only, with country code)</p>
    <input type="text" id="phone" placeholder="e.g. 263786831091" maxlength="15" />
    <button id="btn" onclick="pair()">Get Pairing Code</button>
    <div id="result"></div>
    <ul class="instructions">
      <li>1. Open WhatsApp on your phone</li>
      <li>2. Go to <strong>Settings > Linked Devices</strong></li>
      <li>3. Tap <strong>Link a Device</strong></li>
      <li>4. Tap <strong>Link with phone number instead</strong></li>
      <li>5. Enter the pairing code shown above</li>
    </ul>
  </div>
  <script>
    async function pair() {
      const phone = document.getElementById('phone').value.trim();
      const btn = document.getElementById('btn');
      const result = document.getElementById('result');
      if (!/^\\d{10,15}$/.test(phone)) {
        result.className = 'result error';
        result.innerHTML = 'Invalid number. Use 10-15 digits, no + or spaces.';
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Pairing... (up to 60s)';
      result.className = '';
      result.innerHTML = '';
      try {
        const res = await fetch('/pair', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
        const data = await res.json();
        if (data.success) {
          result.className = 'result success';
          result.innerHTML = 'Your pairing code:<div class="code">' + data.code + '</div>';
        } else {
          result.className = 'result error';
          result.innerHTML = data.error || 'Pairing failed.';
        }
      } catch (e) {
        result.className = 'result error';
        result.innerHTML = 'Network error: ' + e.message;
      }
      btn.disabled = false;
      btn.textContent = 'Get Pairing Code';
    }
  </script>
</body>
</html>`;
  res.send(html);
});

// ── Pairing endpoint (POST) ──────────────────────────────────────────────────
app.post('/pair', async (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number. Use digits only (10-15).' });
  }

  try {
    const pairPromise = new Promise((resolve, reject) => {
      sessionManager.createBot(phone, { phone, resolve, reject });
    });
    const code = await Promise.race([
      pairPromise,
      new Promise((_, rej) => setTimeout(() => rej(new Error('Pairing timeout')), 60000)),
    ]);
    res.json({ success: true, code });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Bot status list ──────────────────────────────────────────────────────────
app.get('/bots', (req, res) => {
  const bots = sessionManager.getAllBots().map(b => ({
    phone: sessionManager.maskPhone(b.phone),
    connected: b.connected,
    uptime: Math.floor((Date.now() - b.startedAt) / 1000) + 's',
  }));
  res.json({ bots });
});

// ── Admin: destroy session ───────────────────────────────────────────────────
app.post('/admin/destroy', async (req, res) => {
  const { phone, secret } = req.body;
  if (secret !== config.adminSecret) return res.status(403).json({ error: 'Unauthorized' });
  if (!phone) return res.status(400).json({ error: 'Phone required' });
  const ok = await sessionManager.destroySession(phone);
  res.json({ success: ok });
});

// ── Dashboard page ───────────────────────────────────────────────────────────
app.get('/dashboard', (req, res) => {
  const bots = sessionManager.getAllBots();
  const connected = bots.filter(b => b.connected).length;
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Tech God Bug 2026 - Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; color: #e0e0e0; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #00ff88; font-size: 2rem; }
    .header p { color: #888; margin-top: 5px; }
    .stats { display: flex; gap: 15px; justify-content: center; margin-bottom: 30px; flex-wrap: wrap; }
    .stat { background: #1a1a1a; border: 1px solid #333; border-radius: 10px; padding: 15px 25px; text-align: center; }
    .stat .num { font-size: 2rem; color: #00ff88; font-weight: bold; }
    .stat .label { color: #888; font-size: 0.85rem; }
    .bots { max-width: 600px; margin: 0 auto; }
    .bot { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 12px 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
    .bot .phone { font-weight: 600; }
    .bot .status { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; }
    .bot .online { background: #00ff8822; color: #00ff88; }
    .bot .offline { background: #ff444422; color: #ff4444; }
    .footer { text-align: center; margin-top: 40px; color: #555; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🐛 Tech God Bug 2026</h1>
    <p>Multi-User WhatsApp Bot Dashboard</p>
  </div>
  <div class="stats">
    <div class="stat"><div class="num">${bots.length}</div><div class="label">Total Bots</div></div>
    <div class="stat"><div class="num">${connected}</div><div class="label">Connected</div></div>
    <div class="stat"><div class="num">${Math.floor(process.uptime())}s</div><div class="label">Uptime</div></div>
  </div>
  <div class="bots">
    ${bots.map(b => `<div class="bot"><span class="phone">${sessionManager.maskPhone(b.phone)}</span><span class="status ${b.connected ? 'online' : 'offline'}">${b.connected ? 'Online' : 'Offline'}</span></div>`).join('')}
    ${bots.length === 0 ? '<p style="text-align:center;color:#666;">No bots connected yet. Use /pair to connect.</p>' : ''}
  </div>
  <div class="footer">Tech God Bug 2026 v${config.botVersion} · By Dev-Ntando</div>
</body>
</html>`;
  res.send(html);
});

module.exports = app;
