import fs from 'fs'

const instaRegex = /(?:https?:\/\/)?(?:www\.)?(instagram\.com|instagr\.am)\/[^\s]+/i
const warnLimit = 5

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (!m.isGroup || m.isBaileys || !m.text) return true
  const chat = global.db.data.chats[m.chat]
  const user = global.db.data.users[m.sender]

  if (!chat.antiinsta) return true
  if (isAdmin) return true

  if (instaRegex.test(m.text)) {
    // Elimina messaggio
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

    // Inizializza warn se mancante
    if (user.warn == null) user.warn = 0
    user.warn++

    // Messaggio fake con immagine locale
    const warnMsg = {
      key: {
        participants: '0@s.whatsapp.net',
        fromMe: false,
        id: 'ANTI-INSTA'
      },
      message: {
        locationMessage: {
          name: `📛 𝐀𝐍𝐓𝐈 - 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌`,
          jpegThumbnail: fs.readFileSync('./icone/instagram.png')
        }
      },
      participant: '0@s.whatsapp.net'
    }

    await conn.sendMessage(m.chat, {
      text: `⚠️ @${m.sender.split('@')[0]}, 𝐢 𝐥𝐢𝐧𝐤 𝐝𝐢 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐧𝐨𝐧 𝐬𝐨𝐧𝐨 𝐜𝐨𝐧𝐬𝐞𝐧𝐭𝐢𝐭𝐢\n📌 𝐚𝐯𝐯𝐢𝐬𝐨: ${user.warn}/${warnLimit}.\n𝐚 𝟓 𝐰𝐚𝐫𝐧 𝐯𝐞𝐫𝐫𝐚 𝐜𝐚𝐜𝐜𝐢𝐚𝐭𝐨.`,
      mentions: [m.sender]
    }, { quoted: warnMsg })

    if (user.warn >= warnLimit) {
      user.warn = 0
      if (isBotAdmin) {
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      }
    }
  }

  return true
}