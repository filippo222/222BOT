import axios from 'axios'

let handler = async (m, { conn }) => {
  let userToWaste

  // ✅ Se c'è una menzione
  if (m.mentionedJid?.length) {
    userToWaste = m.mentionedJid[0]
  }
  // ✅ Se c'è una risposta a un messaggio
  else if (m.quoted) {
    userToWaste = m.quoted.sender
  }

  if (!userToWaste) {
    return m.reply('𝑷𝒆𝒓 𝒇𝒂𝒓𝒆 𝒊𝒍 𝒄𝒐𝒎𝒂𝒏𝒅𝒐, 𝒎𝒆𝒏𝒛𝒊𝒐𝒏𝒂 𝒖𝒏 𝒖𝒕𝒆𝒏𝒕𝒆 𝒐 𝒓𝒊𝒔𝒑𝒐𝒏𝒅𝒊 𝒂 𝒖𝒏 𝒔𝒖𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒈𝒊𝒐.')
  }

  try {
    // 📸 Ottieni immagine profilo
    let profilePic
    try {
      profilePic = await conn.profilePictureUrl(userToWaste, 'image')
    } catch {
      profilePic = 'https://i.imgur.com/2wzGhpF.jpeg'
    }

    // 🎨 Genera effetto wasted
    const wastedUrl = `https://some-random-api.com/canvas/overlay/wasted?avatar=${encodeURIComponent(profilePic)}`
    const { data } = await axios.get(wastedUrl, { responseType: 'arraybuffer' })

    // 📤 Invia immagine
    await conn.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: '☠️ 𝑹𝒊𝒑𝒐𝒔𝒂 𝒊𝒏 𝒑𝒂𝒄𝒆!',
      mentions: [userToWaste]
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ 𝑪\'è 𝒔𝒕𝒂𝒕𝒐 𝒖𝒏 𝒆𝒓𝒓𝒐𝒓𝒆. 𝑹𝒊𝒑𝒓𝒐𝒗𝒂 𝒑𝒊𝒖 𝒕𝒂𝒓𝒅𝒊.')
  }
}

handler.help = ['wasted']
handler.tags = ['fun']
handler.command = ['wasted']
handler.group = false

export default handler