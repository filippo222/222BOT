import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';
import fs from 'fs';

const handler = async (m, { conn, usedPrefix, command }) => {
  const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  const who = mention;

  if (!global.db.data.users[who]) {
    global.db.data.users[who] = {};
  }

  const user = global.db.data.users[who];

  // Inizializza proprietà mancanti
  if (!user.ex) user.ex = [];
  if (!user.figli) user.figli = [];

  let pic;
  try {
    pic = await conn.profilePictureUrl(who, 'image');
  } catch {
    pic = null;
  }

  const prova = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
    message: {
      locationMessage: {
        name: `🧑‍👩‍👧‍👦 𝐏𝐑𝐎𝐅𝐈𝐋𝐎 𝐅𝐀𝐌𝐈𝐆𝐋𝐈𝐀𝐑𝐄`,
        jpegThumbnail: fs.readFileSync('./icone/bal.png'),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  const exList = user.ex.length > 0 ? user.ex.map(jid => `• @${jid.split("@")[0]}`).join('\n') : '— nessuno —';
  const figliList = user.figli.length > 0 ? user.figli.map(jid => `• @${jid.split("@")[0]}`).join('\n') : '— nessuno —';

  const coniugeText = user.coniuge ? `@${user.coniuge.split('@')[0]}` : '— nessuno —';
  const sposatoText = user.sposato ? '💍 Sì' : '❌ No';

  const nameText = user.name && user.name.trim() !== '' ? user.name : 'Sconosciuto';

  const text = `
╔════════════╗
║    𝐏𝐫𝐨𝐟𝐢𝐥𝐨 𝐅𝐚𝐦𝐢𝐠𝐥𝐢𝐚𝐫𝐞    ║
╚════════════╝

> 👤 𝐍𝐨𝐦𝐞: ${nameText}

💍 𝐒𝐩𝐨𝐬𝐚𝐭𝐨/𝐚: ${sposatoText}
🤵 𝐂𝐨𝐧𝐢𝐮𝐠𝐞: ${coniugeText}

💔 𝐄𝐱 𝐂𝐨𝐧𝐢𝐮𝐠𝐢:
${exList}

👶 𝐅𝐢𝐠𝐥𝐢:
${figliList}
`;

  await conn.sendMessage(m.chat, {
    text,
    contextInfo: {
      mentionedJid: [
        ...(user.coniuge ? [user.coniuge] : []),
        ...user.ex,
        ...user.figli
      ],
      externalAdReply: {
        showAdAttribution: true,
        sourceUrl: `https://wa.me/${who.split("@")[0]}`,
        thumbnail: pic
          ? await (await fetch(pic)).buffer()
          : await (await fetch('https://telegra.ph/file/17e7701f8b0a63806e312.png')).buffer()
      }
    }
  }, { quoted: prova });
};

handler.command = ['famiglia'];
export default handler;