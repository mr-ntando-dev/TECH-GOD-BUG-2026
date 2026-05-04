/**
 * 🐛 Tech God Bug 2026 — Session Utilities
 * Handles session decoding and cleanup.
 * By Dev-Ntando
 */
'use strict';

const fs   = require('fs');
const path = require('path');

function decodeSession(sessionID) {
  if (!sessionID) return null;
  try {
    const decoded = Buffer.from(sessionID, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function clearSession(sessionDir) {
  try {
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true });
    }
  } catch (e) {
    console.error('[Session] Failed to clear:', e.message);
  }
}

module.exports = { decodeSession, clearSession };
