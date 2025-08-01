import axios from 'axios'

let handler = async (m, { conn }) => {
  let userToGlass

  if (m.mentionedJid?.length) {
    userToGlass = m.mentionedJid[0]
  } else if (m.quoted) {
    userToGlass = m.quoted.sender
  }

  if (!userToGlass) {
    return m.reply('🔍 𝑴𝒆𝒕𝒕𝒊 𝒖𝒏𝒂 𝒎𝒆𝒏𝒛𝒊𝒐𝒏𝒆 𝒐 𝒓𝒊𝒔𝒑𝒐𝒏𝒅𝒊 𝒂 𝒖𝒏 𝒎𝒆𝒔𝒔𝒂𝒈𝒈𝒊𝒐 𝒑𝒆𝒓 𝒂𝒑𝒑𝒍𝒊𝒄𝒂𝒓𝒆 𝒆𝒇𝒇𝒆𝒕𝒕𝒐.')
  }

  try {
    let profilePic
    try {
      profilePic = await conn.profilePictureUrl(userToGlass, 'image')
    } catch {
      profilePic = 'https://i.imgur.com/2wzGhpF.jpeg'
    }

    const url = `https://some-random-api.com/canvas/overlay/glass?avatar=${encodeURIComponent(profilePic)}`
    const { data } = await axios.get(url, { responseType: 'arraybuffer' })

    await conn.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: '🪟 𝑬𝒇𝒇𝒆𝒕𝒕𝒐 𝒗𝒆𝒕𝒓𝒐!',
      mentions: [userToGlass]
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ 𝑬𝒓𝒓𝒐𝒓𝒆. 𝑹𝒊𝒑𝒓𝒐𝒗𝒂 𝒑𝒊𝒖̀ 𝒕𝒂𝒓𝒅𝒊.')
  }
}

handler.help = ['glass']
handler.tags = ['fun']
handler.command = ['glass']
handler.group = false

export default handler