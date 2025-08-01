import axios from 'axios'

let handler = async (m, { conn }) => {
  let userToJail

  // ✅ Se c'è una menzione
  if (m.mentionedJid?.length) {
    userToJail = m.mentionedJid[0]
  }
  // ✅ Se c'è una risposta a un messaggio
  else if (m.quoted) {
    userToJail = m.quoted.sender
  }

  if (!userToJail) {
    return m.reply('👮 𝑷𝒆𝒓 𝒎𝒂𝒏𝒅𝒂𝒓𝒆 𝒒𝒖𝒂𝒍𝒄𝒖𝒏𝒐 𝒊𝒏 𝒄𝒂𝒓𝒄𝒆𝒓𝒆, 𝒎𝒆𝒏𝒛𝒊𝒐𝒏𝒂 𝒖𝒏 𝒖𝒕𝒆𝒏𝒕𝒆 𝒐 𝒓𝒊𝒔𝒑𝒐𝒏𝒅𝒊 𝒂 𝒖𝒏 𝒔𝒖𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒈𝒊𝒐.')
  }

  try {
    // 📸 Ottieni immagine profilo
    let profilePic
    try {
      profilePic = await conn.profilePictureUrl(userToJail, 'image')
    } catch {
      profilePic = 'https://i.imgur.com/2wzGhpF.jpeg'
    }

    // 🎨 Genera effetto jail
    const jailUrl = `https://some-random-api.com/canvas/overlay/jail?avatar=${encodeURIComponent(profilePic)}`
    const { data } = await axios.get(jailUrl, { responseType: 'arraybuffer' })

    // 📤 Invia immagine
    await conn.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: '🚔 𝑨𝒓𝒓𝒆𝒔𝒕𝒂𝒕𝒐! 🔒',
      mentions: [userToJail]
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ 𝑪\'è 𝒔𝒕𝒂𝒕𝒐 𝒖𝒏 𝒆𝒓𝒓𝒐𝒓𝒆. 𝑹𝒊𝒑𝒓𝒐𝒗𝒂 𝒑𝒊𝒖 𝒕𝒂𝒓𝒅𝒊.')
  }
}

handler.help = ['jail']
handler.tags = ['fun']
handler.command = ['jail']
handler.group = false

export default handler