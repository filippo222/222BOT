const handler = m => m;

// Sostituisci questo con il tuo numero in formato JID WhatsApp
const ownerJid = '393201448716@s.whatsapp.net'; // <--- METTI QUI IL TUO NUMERO

async function handlePromotion(message) {
  const promoter = message.sender;
  const promoted = message.messageStubParameters[0];
  const groupMetadata = await conn.groupMetadata(message.chat);
  const groupName = groupMetadata.subject;

  let pic;
  try {
    pic = await conn.profilePictureUrl(promoted, 'image');
  } catch (error) {
    console.error("Errore nel prendere la foto profilo:", error);
    pic = null;
  }

  const text = `👑 L'utente @${promoter.split('@')[0]} ha **promosso** @${promoted.split('@')[0]} nel gruppo *${groupName}*`;

  await conn.sendMessage(ownerJid, {
    text,
    contextInfo: {
      mentionedJid: [promoter, promoted],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {},
      externalAdReply: {
        title: '𝐍𝐨𝐭𝐢𝐟𝐢𝐜𝐚 𝐝𝐢 𝐏𝐫𝐨𝐦𝐨𝐳𝐢𝐨𝐧𝐞 👑',
        thumbnail: pic
          ? await (await fetch(pic)).buffer()
          : await (await fetch('https://qu.ax/cSqEs.jpg')).buffer(),
      },
    },
  });
}

async function handleDemotion(message) {
  const demoter = message.sender;
  const demoted = message.messageStubParameters[0];
  const groupMetadata = await conn.groupMetadata(message.chat);
  const groupName = groupMetadata.subject;

  let pic;
  try {
    pic = await conn.profilePictureUrl(demoted, 'image');
  } catch (error) {
    console.error("Errore nel prendere la foto profilo:", error);
    pic = null;
  }

  const text = `🙇🏻‍♂️ L'utente @${demoter.split('@')[0]} ha **rimosso** @${demoted.split('@')[0]} dai poteri di admin nel gruppo *${groupName}*`;

  await conn.sendMessage(ownerJid, {
    text,
    contextInfo: {
      mentionedJid: [demoter, demoted],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {},
      externalAdReply: {
        title: '𝐍𝐨𝐭𝐢𝐟𝐢𝐜𝐚 𝐝𝐢 𝐑𝐞𝐭𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐨𝐧𝐞 🙇🏻‍♂️',
        thumbnail: pic
          ? await (await fetch(pic)).buffer()
          : await (await fetch('https://qu.ax/cSqEs.jpg')).buffer(),
      },
    },
  });
}

handler.all = async function (m) {
  if (m.messageStubType === 29) {
    await handlePromotion(m);
  } else if (m.messageStubType === 30) {
    await handleDemotion(m);
  }
};

export default handler;