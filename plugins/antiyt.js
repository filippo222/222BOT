import fs from 'fs'

const ytRegex = /(?:https?:\/\/)?(?:www\.)?(youtube\.com|youtu\.be)\/[^\s]+/i

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (!m.isGroup || m.isBaileys || !m.text) return true
  const chat = global.db.data.chats[m.chat]

  if (!chat.antiyt) return true
  if (isAdmin) return true
  if (!ytRegex.test(m.text)) return true

  // Elimina il messaggio
  if (isBotAdmin) {
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.key.participant
      }
    })
  }

  // Invia messaggio fake (location style)
  const fake = {
    key: {
      participants: '0@s.whatsapp.net',
      fromMe: false,
      id: 'ANTI-YT'
    },
    message: {
      locationMessage: {
        name: '🚫 𝐀𝐍𝐓𝐈 - 𝐘𝐎𝐔𝐓𝐔𝐁𝐄',
        jpegThumbnail: fs.readFileSync('./icone/youtube.png')
      }
    },
    participant: '0@s.whatsapp.net'
  }

  await conn.sendMessage(m.chat, {
    text: `🚫 @${m.sender.split('@')[0]}, i link YouTube non sono consentiti in questo gruppo!`,
    mentions: [m.sender]
  }, { quoted: fake })

  return true
}