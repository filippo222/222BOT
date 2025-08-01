import os from 'os';
import { performance } from 'perf_hooks';

const toMathematicalAlphanumericSymbols = number => {
  const map = {
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return number.toString().split('').map(digit => map[digit] || digit).join('');
};

const clockString = ms => {
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  return `${toMathematicalAlphanumericSymbols(days.toString().padStart(2, '0'))}𝕕 : ${toMathematicalAlphanumericSymbols(hours.toString().padStart(2, '0'))}𝕙 : ${toMathematicalAlphanumericSymbols(minutes.toString().padStart(2, '0'))}𝕞 : ${toMathematicalAlphanumericSymbols(seconds.toString().padStart(2, '0'))}𝕤`;
};

const handler = async (m, { conn, usedPrefix }) => {
  const _uptime = process.uptime() * 1000;
  const uptime = clockString(_uptime);

  const start = performance.now();
  const end = performance.now();
  const speed = (end - start).toFixed(4);
  const speedWithFont = toMathematicalAlphanumericSymbols(speed);

  const nomeDelBot = global.db?.data?.nomedelbot || 'Svoᵇᵒᵗ';

  const info = `
╭━━━━━━━━━━━━━╮
┃ 🚀  𝐏𝐈𝐍𝐆 𝐁𝐎𝐓 🚀
┣━━━━━━━━━━━━━┫
┃⏳ 𝐀𝐭𝐭𝐢𝐯𝐢𝐭𝐚̀: ${uptime}
┃⚡ 𝐑𝐢𝐬𝐩𝐨𝐬𝐭𝐚: ${speedWithFont} 𝐬𝐞𝐜
╰━━━━━━━━━━━━━╯
`;

  await conn.sendMessage(
    m.chat,
    {
      text: info.trim(),
      footer: '✦ Scegli un\'opzione:',
      buttons: [
        { buttonId: `${usedPrefix}ds`, buttonText: { displayText: '🧹 Cancella Sessioni' }, type: 1 },
        { buttonId: `${usedPrefix}speedtest`, buttonText: { displayText: '⚡ Speedtest' }, type: 1 }
      ],
      headerType: 1
    },
    { quoted: m }
  );
};

handler.command = /^(ping)$/i;
export default handler;