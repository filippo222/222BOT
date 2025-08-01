const time = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { conn, text, args, command }) => {
  const MAX_WARN = 3;
  const who = m.isGroup
    ? m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null)
    : m.chat;

  if (!who) return m.reply('🚫 𝑻𝒂𝒈𝒈𝒂 𝒐 𝒓𝒊𝒔𝒑𝒐𝒏𝒅𝒊 𝒂 𝒖𝒏 𝒖𝒕𝒆𝒏𝒕𝒆.');

  global.db.data.users[who] = global.db.data.users[who] || { warn: 0 };
  const userData = global.db.data.users[who];
  const warnCount = userData.warn;

  const reason = text?.replace(/@\d+/, '').trim();
  const thumb = await (await fetch('https://qu.ax/fmHdc.png')).buffer();

  const styledCard = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "MOD"
    },
    message: {
      locationMessage: {
        name: '🕊 𝓜𝓸𝓭𝓮𝓻𝓪𝔃𝓲𝓸𝓷𝓮 • 222ᴮᴼᵀ',
        jpegThumbnail: thumb,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:222Bot\nTEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  // WARN
  if (command === 'warn' || command === 'ammonisci') {
    if (warnCount < MAX_WARN - 1) {
      userData.warn += 1;
      return conn.reply(m.chat, `
╭━〔 ⚠️ 𝑨𝑽𝑽𝑬𝑹𝑻𝑰𝑴𝑬𝑵𝑻𝑶 ⚠️ 〕━╮
┃ 👤 𝑼𝒕𝒆𝒏𝒕𝒆: @${who.split('@')[0]}
┃ 🧾 𝑺𝒕𝒂𝒕𝒐: ${userData.warn} / ${MAX_WARN}
┃ ✍️ 𝑴𝒐𝒕𝒊𝒗𝒐: ${reason || '—'}
╰━━━━━━━━━━━━━━━━╯
`, styledCard, { mentions: [who] });
    } else {
      userData.warn = 0;
      await conn.reply(m.chat, `
╭━〔 ⛔ 𝑬𝑺𝑷𝑼𝑳𝑺𝑶 ⛔ 〕━╮
┃ 👤 𝑼𝒕𝒆𝒏𝒕𝒆: @${who.split('@')[0]}
┃ 💣 𝑴𝒐𝒕𝒊𝒗𝒐: 3 avvertimenti
╰━━━━━━━━━━━━━╯
`, styledCard, { mentions: [who] });
      await time(1000);
      await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
    }
  }

  // UNWARN
  if (command === 'unwarn' || command === 'delwarn') {
    if (warnCount > 0) {
      userData.warn -= 1;
      return conn.reply(m.chat, `
╭━〔 ✅ 𝑨𝑽𝑽. 𝑹𝑰𝑴𝑶𝑺𝑺𝑶 ✅ 〕━╮
┃ 👤 𝑼𝒕𝒆𝒏𝒕𝒆: @${who.split('@')[0]}
┃ 📉 𝑺𝒕𝒂𝒕𝒐: ${userData.warn} / ${MAX_WARN}
╰━━━━━━━━━━━━━━━╯
`, styledCard, { mentions: [who] });
    } else {
      return m.reply('🎩 𝑳’𝒖𝒕𝒆𝒏𝒕𝒆 𝒏𝒐𝒏 𝒉𝒂 𝒂𝒗𝒗𝒆𝒓𝒕𝒊𝒎𝒆𝒏𝒕𝒊 𝒂𝒕𝒕𝒊𝒗𝒊.');
    }
  }
};

handler.command = ['warn', 'ammonisci', 'unwarn', 'delwarn'];
handler.help = ['warn @utente [motivo]', 'unwarn @utente'];
handler.tags = ['moderation'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;