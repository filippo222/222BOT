import 'os';
import 'util';
import 'human-readable';
import '@whiskeysockets/baileys';
import 'fs';
import 'perf_hooks';

let handler = async (_0x4955de, { conn: _0x4b9a49, usedPrefix: _0xeb2cc9 }) => {
  let _0x414c2d = {
    'key': {
      'participants': "0@s.whatsapp.net",
      'fromMe': false,
      'id': 'Halo'
    },
    'message': {
      'locationMessage': {
        'name': "Bot Info",
        'jpegThumbnail': await (await fetch("https://qu.ax/cSqEs.jpg")).buffer(),
        'vcard': "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
      }
    },
    'participant': "0@s.whatsapp.net"
  };
  
  // Messaggio migliorato con una grafica più pulita e visivamente accattivante
  let _0x259d4e = `
════════════════════
 *𝐈𝐧𝐟𝐨𝐁𝐨𝐭* 

➤ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫𝐞: +393270466066

➤ 𝐍𝐨𝐦𝐞 𝐁𝐨𝐭:     ꙰222 ꙰ 𝔹𝕆𝕋 ꙰

 
➤ 𝐂𝐫𝐞𝐚𝐭𝐨 𝐢𝐥:  *22/02/2222*

➤𝐆𝐢𝐭𝐡𝐮𝐛: *https://github.com/*

 ꙰222 ꙰ 𝔹𝕆𝕋 ꙰ 
════════════════════
`.trim();
  
  let _0xf5c7c0 = global.db.data.nomedelbot || " ꙰222 ꙰ 𝔹𝕆𝕋 ꙰ ";
  
  // Invia il messaggio con una grafica migliorata
  _0x4b9a49.sendMessage(_0x4955de.chat, {
    'text': _0x259d4e,
    'contextInfo': {
      'mentionedJid': _0x4b9a49.parseMention(wm),
      'forwardingScore': 0x1,
      'isForwarded': true,
      'forwardedNewsletterMessageInfo': {
        'newsletterJid': "120363419757666459@newsletter",
        'serverMessageId': '',
        'newsletterName': ' ꙰222 ꙰ 𝔹𝕆𝕋 ꙰ ✦'
      }
    }
  }, {
    'quoted': _0x414c2d
  });
};

handler.help = ["menu"];
handler.tags = ["menu"];
handler.command = /^(botinfo)$/i;
export default handler;

// Funzione per calcolare il tempo di attività
function clockString(_0x5dad08) {
  let _0x233c78 = Math.floor(_0x5dad08 / 3600000);
  let _0x2b10bc = Math.floor(_0x5dad08 / 60000) % 60;
  let _0x2c7d73 = Math.floor(_0x5dad08 / 1000) % 60;
  console.log({
    'ms': _0x5dad08,
    'h': _0x233c78,
    'm': _0x2b10bc,
    's': _0x2c7d73
  });
  return [_0x233c78, _0x2b10bc, _0x2c7d73].map(_0x4bd0ef => _0x4bd0ef.toString().padStart(2, 0)).join(':');
}