let handler = async (m, { conn, command, text, usedPrefix }) => {
  let target, tag;

  if (!text) {
    if (m.quoted && m.quoted.sender) {
      target = m.quoted.sender;
      tag = target.split('@')[0]; // Ottieni il numero
    } else {
      return conn.reply(m.chat, `⚠️ Devi menzionare qualcuno o rispondere a un messaggio! Esempio: ${usedPrefix + command} @utente`, m);
    }
  } else {
    tag = text.replace(/[@\s+]/g, ''); // Pulisci @ e spazi
    target = tag + '@s.whatsapp.net';
  }

  let percentage = Math.floor(Math.random() * 100) + 1;

  let responses = {
    'gay2': {
      emoji: '🏳️‍🌈',
      messages: [
        `@${tag} è ${percentage}% gay! ${percentage > 80 ? 'Pride parade quando?' : ''}`,
        `Risultato test: @${tag} è ${percentage}% parte della comunità arcobaleno!`,
        `🌈 @${tag} sta a ${percentage}% dalla parte sbagliata... o giusta?`
      ]
    },
    // Altri comandi qui...
  };

  let cmd = command.toLowerCase();
  let response = responses[cmd] || {
    emoji: '❓',
    messages: [`@${tag} è ${percentage}% ${cmd}!`]
  };

  let randomMessage = response.messages[Math.floor(Math.random() * response.messages.length)];

  await conn.sendMessage(m.chat, {
    text: `${response.emoji} ${randomMessage}`,
    mentions: [target]
  }, { quoted: m });
};

handler.help = ['gay2', 'lesbica', 'puttana', 'prostituta', 'prostituto'].map(v => v + ' @tag | rispondi');
handler.tags = ['fun'];
handler.command = /^(gay2)$/i;

export default handler;