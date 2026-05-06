/**
 * 🐛 Tech God Bug 2026 — System Info Command
 * Owner only: displays server/process resource usage.
 * By Dev-Ntando
 */
'use strict';

const os      = require('os');
const antiban = require('../../utils/antiban');
const config  = require('../../config');

function fmtBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  return `${(b / 1024 ** 3).toFixed(2)} GB`;
}

module.exports = async (sock, msg, args, { isOwner, jid }) => {
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Owner only command.' }, { quoted: msg });
  }

  const mem     = process.memoryUsage();
  const totMem  = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totMem - freeMem;
  const up      = process.uptime();
  const upStr   = `${Math.floor(up / 3600)}h ${Math.floor((up % 3600) / 60)}m ${Math.floor(up % 60)}s`;
  const cpus    = os.cpus();
  const cpu     = cpus[0]?.model || 'Unknown';
  const cores   = cpus.length;

  await antiban.sendHuman(sock, jid, {
    text: [
      `🖥️ *System Info — ${config.botName}*`,
      ``,
      `⚡ *Process*`,
      `  ╰┈➤ Node: ${process.version}`,
      `  ╰┈➤ Platform: ${process.platform}`,
      `  ╰┈➤ Uptime: ${upStr}`,
      `  ╰┈➤ PID: ${process.pid}`,
      ``,
      `🧠 *Memory*`,
      `  ╰┈➤ Heap Used: ${fmtBytes(mem.heapUsed)}`,
      `  ╰┈➤ Heap Total: ${fmtBytes(mem.heapTotal)}`,
      `  ╰┈➤ RSS: ${fmtBytes(mem.rss)}`,
      `  ╰┈➤ System Used: ${fmtBytes(usedMem)} / ${fmtBytes(totMem)}`,
      ``,
      `⚙️ *CPU*`,
      `  ╰┈➤ ${cpu}`,
      `  ╰┈➤ Cores: ${cores}`,
      ``,
      `🌐 *Host*`,
      `  ╰┈➤ Hostname: ${os.hostname()}`,
      `  ╰┈➤ OS: ${os.type()} ${os.release()}`,
      ``,
      `_🐛 Tech God Bug 2026 · ${config.botName}_`,
    ].join('\n'),
  }, { quoted: msg });
};
