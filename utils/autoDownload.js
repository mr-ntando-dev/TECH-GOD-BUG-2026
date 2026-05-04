/**
 * 🐛 Tech God Bug 2026 — Auto Download Detection
 * Detects links in messages for auto-download feature.
 * By Dev-Ntando
 */
'use strict';

const LINK_REGEX = /https?:\/\/[^\s]+/gi;
const PLATFORMS = [
  { name: 'tiktok',    regex: /tiktok\.com/i },
  { name: 'youtube',   regex: /(youtube\.com|youtu\.be)/i },
  { name: 'instagram', regex: /(instagram\.com|instagr\.am)/i },
  { name: 'facebook',  regex: /(facebook\.com|fb\.watch)/i },
  { name: 'pinterest', regex: /pinterest\.(com|co)/i },
];

function detectLink(text) {
  if (!text) return false;
  return LINK_REGEX.test(text);
}

function extractUrl(text) {
  if (!text) return null;
  const match = text.match(LINK_REGEX);
  return match ? match[0] : null;
}

function detectPlatform(url) {
  if (!url) return null;
  for (const p of PLATFORMS) {
    if (p.regex.test(url)) return p.name;
  }
  return null;
}

module.exports = { detectLink, extractUrl, detectPlatform };
