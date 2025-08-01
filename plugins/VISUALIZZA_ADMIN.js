const handler = m => m;  // This can be removed if not used elsewhere

async function handlePromotion(message) {
  let pic;
  try {
    pic = await conn.profilePictureUrl(message.messageStubParameters[0], 'image');
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    pic = null;
  }

  const text = `@${message.sender.split('@')[0]} 𝐡𝐚 𝐝𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${message.messageStubParameters[0].split('@')[0]}`;

  await conn.sendMessage(message.chat, {
    text,
    contextInfo: {
      mentionedJid: [message.sender, message.messageStubParameters[0]],
      forwardingScore: 99,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
      },
      externalAdReply: {
        title: '𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐩𝐫𝐨𝐦𝐨𝐳𝐢𝐨𝐧𝐞 👑',
        thumbnail: pic ? await (await fetch(pic)).buffer() : await (await fetch('https://qu.ax/cSqEs.jpg')).buffer(),
      },
    },
  });
}

async function handleDemotion(message) {
  let pic;
  try {
    pic = await conn.profilePictureUrl(message.messageStubParameters[0], 'image');
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    pic = null;
  }

  const text = `@${message.sender.split('@')[0]} 𝐡𝐚 𝐥𝐞𝐯𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${message.messageStubParameters[0].split('@')[0]}`;

  await conn.sendMessage(message.chat, {
    text,
    contextInfo: {
      mentionedJid: [message.sender, message.messageStubParameters[0]],
      forwardingScore: 99,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
      },
      externalAdReply: {
        title: '𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐫𝐞𝐭𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐨𝐧𝐞 🙇🏻‍♂️',
        thumbnail: pic ? await (await fetch(pic)).buffer() : await (await fetch('https://qu.ax/cSqEs.jpg')).buffer(),
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