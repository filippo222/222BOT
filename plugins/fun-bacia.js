import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  let who;

  // Determina chi baciare (in gruppo o chat privata)
  if (m.isGroup) {
    who = m.mentionedJid?.[0] 
      || (m.quoted ? m.quoted.sender : null)
      || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
  } else {
    who = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat;
  }

  if (!who) return m.reply('💋 𝐌𝐞𝐧𝐳𝐢𝐨𝐧𝐚 𝐜𝐡𝐢 𝐯𝐮𝐨𝐢 𝐛𝐚𝐜𝐢𝐚𝐫𝐞!');

  // Immagine miniatura carina
  const thumbnailUrl = "https://telegra.ph/file/c38c74851520adb48b684.png";
  const thumbnailBuffer = await (await fetch(thumbnailUrl)).buffer();

  // Messaggio stiloso con emoji e decorazioni
  const textMsg = `
💞 𝘽𝙖𝙘𝙞𝙤 𝙢𝙖𝙜𝙞𝙘𝙤 💞

✨ @${m.sender.split('@')[0]} 𝐡𝐚 𝐜𝐨𝐧𝐪𝐮𝐢𝐬𝐭𝐚𝐭𝐨 𝐢𝐥 𝐜𝐮𝐨𝐫𝐞 𝐝𝐢 @${who.split('@')[0]}! ✨

══════ 💋 ═══════
`;

  // Invia messaggio con thumbnail e mentions
  let sentMsg = await conn.sendMessage(m.chat, {
    text: textMsg,
    mentions: [m.sender, who],
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaType: 2,
        title: "💖 Bacio romantico 💖",
        body: "Spread love 💌",
        thumbnail: thumbnailBuffer,
        sourceUrl: "https://telegra.ph/file/c38c74851520adb48b684.png"
      }
    }
  }, { quoted: m });

  // Reazione emoji di bacio al messaggio inviato
  await conn.sendMessage(m.chat, { react: { text: '💋', key: sentMsg.key } });
};

handler.command = ['bacia'];
export default handler;