import fs from 'fs';
import fetch from 'node-fetch';

async function handler(m, { isBotAdmin, isOwner, text, conn }) {
  if (!isBotAdmin) return m.reply(`
╔══❰ 𝗔𝗖𝗖𝗘𝗦𝗦𝗢 𝗡𝗘𝗚𝗔𝗧𝗢 ❱══╗
┃ ⚠️  𝘼𝙘𝙘𝙚𝙨𝙨𝙤 𝙧𝙞𝙘𝙝𝙞𝙚𝙨𝙩𝙤: *kick*
┃ ❌  𝙄𝙡 𝙗𝙤𝙩 𝙙𝙚𝙫𝙚 𝙚𝙨𝙨𝙚𝙧𝙚 𝙖𝙙𝙢𝙞𝙣.
╚════════════════╝
`.trim());

  const mention = m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.quoted
      ? m.quoted.sender
      : null;

  if (!mention) return m.reply(`
        ⬢ 𝙄𝙉𝙋𝙐𝙏 𝙈𝘼𝙉𝘾𝘼𝙉𝙏𝙀 ⬢
  ❗  Devi *menzionare* un utente da rimuovere.
  ✏️  Esempio: kick @utente [motivo] 
`.trim());

  const ownerBot = global.owner[0][0] + '@s.whatsapp.net';
  if (mention === ownerBot) return m.reply('👑 *Non puoi toccare il creatore del bot!*');
  if (mention === conn.user.jid) return m.reply('🤖 *Non posso auto-espellermi…*');
  if (mention === m.sender) return m.reply('🙃 *Stai cercando di espellere te stesso?*');

  const groupMetadata = conn.chats[m.chat].metadata;
  const participants = groupMetadata.participants;
  const utente = participants.find(u => conn.decodeJid(u.id) === mention);

  const isGroupOwner = utente?.admin === 'superadmin';
  const isAdmin = utente?.admin === 'admin';

  if (isGroupOwner) return m.reply(`
⛔ 𝗔𝗡𝗧𝗜-𝗞𝗜𝗖𝗞 ⛔
👑 *Impossibile rimuovere il creatore del gruppo!*
`.trim());

  if (isAdmin) return m.reply(`
🛡️ 𝗔𝗡𝗧𝗜-𝗞𝗜𝗖𝗞 🛡️
👮 *Non puoi rimuovere un amministratore!*
`.trim());

  // Thumbnail e citazione stilizzata
  const fakeQuoted = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Kick"
    },
    message: {
      locationMessage: {
        name: '💥 Espulsione imminente...',
        jpegThumbnail: await (await fetch('https://telegra.ph/file/ed97f8c272e8e88f77cc0.png')).buffer()
      }
    },
    participant: "0@s.whatsapp.net"
  };

  const motivo = text.replace(mention, '').trim();
  const reasonLine = motivo ? `┃ 💬  Motivo: *${motivo}*` : '┃ 💬  Nessun motivo specificato.';

  // Messaggio figo finale
  const messaggioFinale = `
╭━━〔 🔥 ESPULSO 🔥 〕━━╮
┃👤 Utente: @${mention.split('@')[0]}
┃🚨 Rimosso da: @${m.sender.split('@')[0]}
${reasonLine}
╰━━━━━━━━━━━━━━━╯
`.trim();

  await conn.sendMessage(
    m.chat,
    {
      text: messaggioFinale,
      mentions: [mention, m.sender]
    },
    { quoted: fakeQuoted }
  );

  await conn.groupParticipantsUpdate(m.chat, [mention], 'remove');
}

// ✅ Valido solo se è la PRIMA parola della frase
handler.customPrefix = /^(kick|avadakedavra|sparisci|puffo)\b/i;
handler.command = new RegExp;
handler.admin = true;

export default handler;