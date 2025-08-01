import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  const tag = '@' + m.sender.split('@')[0]

  const fake = {
    key: {
      participants: '0@s.whatsapp.net',
      fromMe: false,
      id: 'Halo'
    },
    message: {
      locationMessage: {
        name: '𝐂𝐈𝐀𝐎 𝐑𝐀𝐆𝐀𝐙𝐙𝐈 👋',
        jpegThumbnail: await (await fetch('https://telegra.ph/file/ed97f8c272e8e88f77cc0.png')).buffer()
      }
    },
    participant: '0@s.whatsapp.net'
  }

  const messaggio = `*𝐂𝐈𝐀𝐎 𝐑𝐀𝐆𝐀𝐙𝐙𝐈* 👋\n𝐒𝐈𝐄𝐓𝐄 𝐒𝐓𝐀𝐓𝐈 𝐒𝐀𝐋𝐔𝐓𝐀𝐓𝐈 𝐃𝐀 ${tag}\n𝐒𝐀𝐋𝐔𝐓𝐀𝐓𝐄 𝐀𝐍𝐂𝐇𝐄 𝐕𝐎𝐈 𝐏𝐄𝐑 𝐄𝐃𝐔𝐂𝐀𝐙𝐈𝐎𝐍𝐄 🫡`

  await conn.sendMessage(m.chat, {
    text: messaggio,
    mentions: [m.sender]
  }, { quoted: fake })
}

handler.command = /^ciao$/i
export default handler