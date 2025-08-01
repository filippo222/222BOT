const handler = async (m, { conn, usedPrefix, command }) => {
  let target = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
  if (!target) {
    return conn.reply(m.chat, `❗ *Tagga un utente o rispondi a un messaggio.*\n\n✨ *Esempio:* ${usedPrefix + command} @utente`, m);
  }

  let name = await conn.getName(target);
  let num = target.split('@')[0];

  let ip = `${rand255()}.${rand255()}.${rand255()}.${rand255()}`;
  let gpsLat = (Math.random() * (45 - 37) + 37).toFixed(6);
  let gpsLon = (Math.random() * (15 - 6) + 6).toFixed(6);

  let paesi = ['🇮🇹 Italia', '🇫🇷 Francia', '🇩🇪 Germania', '🇪🇸 Spagna', '🇧🇷 Brasile', '🇺🇸 USA'];
  let isps = ['TIM', 'Vodafone', 'Fastweb', 'WindTre', 'Iliad', 'Sky Wifi'];
  let provider = ['Telecom Italia', 'Open Fiber', 'Tiscali S.p.A', 'BT Italia'];
  let wifis = ['Vodafone-24G', 'CasaMia_WIFI', 'FASTWEB-5G', 'Iliad_Hub', 'TP-Link-Guest'];

  let codiceFiscale = generateFakeCF(name);

  let brain = Math.floor(Math.random() * 40);

  let msg = `
╔═══════════════╗
║     🌐 𝐃𝐎𝐗 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 🌐    ║
╠═══════════════╣
║ 🔖 𝐍𝐨𝐦𝐞: ${name}
║ 📱 𝐍𝐮𝐦𝐞𝐫𝐨: +${num}
║ 🧠 𝐐𝐈: ${brain}%
║ 🌍 𝐏𝐚𝐞𝐬𝐞: ${paesi.random()}
║ 🌐 𝐈𝐏: ${ip}
║ 📶 𝐖𝐢𝐅𝐢: ${wifis.random()}
║ 🛰 𝐈𝐒𝐏: ${isps.random()}
║ 🏢 𝐏𝐫𝐨𝐯𝐢𝐝𝐞𝐫: ${provider.random()}
║ 📍 𝐆𝐏𝐒: ${gpsLat}, ${gpsLon}
║ 🆔 𝐂.𝐅: ${codiceFiscale}
║ 🚔 𝐒𝐞𝐠𝐧𝐚𝐥𝐚𝐭𝐨 𝐚𝐥𝐥𝐚 𝐏𝐨𝐥𝐢𝐳𝐢𝐚
╚═══════════════╝

✨ 𝟐𝟐𝟐 𝐁𝚯𝐓 - Confidential
`.trim();

  // Messaggio quotato con locationMessage
  const botName = global.db?.data?.nomedelbot || "𝐒𝐯𝐨²²² 𝐁𝚯𝐓";
  const quotedLocation = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: 'Halo'
    },
    message: {
      locationMessage: {
        name: botName,
        degreesLatitude: parseFloat(gpsLat),
        degreesLongitude: parseFloat(gpsLon),
        jpegThumbnail: null
      }
    },
    participant: '0@s.whatsapp.net'
  };

  await conn.reply(m.chat, msg, m, { mentions: [target], quoted: quotedLocation });
};

// Funzione helper: genera un codice fiscale finto ma con struttura simile all’originale
function generateFakeCF(name) {
  const consonants = str => (str.match(/[BCDFGHJKLMNPQRSTVWXYZ]/gi) || []).join('');
  const vowels = str => (str.match(/[AEIOU]/gi) || []).join('');

  let n = name.toUpperCase().replace(/[^A-Z]/g, '');

  // Prendi le prime 3 consonanti, se non ci sono 3 prendi vocali, poi X per mancanza
  let cf = consonants(n).padEnd(3, 'X').slice(0, 3);

  // Aggiungo 3 lettere casuali per nome/fake cognome (simile a originale)
  cf += consonants(n).length >= 4 ? consonants(n).slice(3, 6).padEnd(3, 'X') : 'XXX';

  // Anno di nascita (due cifre casuali 50-99)
  let year = (Math.floor(Math.random() * 50) + 50).toString();

  // Mese (lettera da A a P, escluso I, corrispondente a mesi nel codice fiscale)
  const mesi = 'ABCDEHLMPRST'; // lettere mese in CF
  let month = mesi.charAt(Math.floor(Math.random() * mesi.length));

  // Giorno (01-31)
  let day = (Math.floor(Math.random() * 31) + 1).toString().padStart(2, '0');

  // 4 caratteri alfanumerici casuali
  let randomEnd = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 4; i++) {
    randomEnd += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${cf}${year}${month}${day}${randomEnd}`;
}

function rand255() {
  return Math.floor(Math.random() * 256);
}

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

handler.help = ['dox @tag'];
handler.tags = ['fun'];
handler.command = /^dox$/i;

export default handler;