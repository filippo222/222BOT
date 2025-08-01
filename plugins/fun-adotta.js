const adoptions = {}

let handler = async (m, { conn, command, usedPrefix }) => {
  let users = global.db.data.users
  let user = users[m.sender]

  switch (command) {
    case 'adotta':
      await handleAdotta(m, user, users, usedPrefix, conn)
      break
    case 'abbandona':
      await handleAbbandona(m, user, users, conn)
      break
  }
}

const handleAdotta = async (m, user, users, usedPrefix, conn) => {
  let mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null)
  if (!mention) throw `👶 𝐓𝐚𝐠𝐠𝐚 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐜𝐡𝐞 𝐯𝐮𝐨𝐢 𝐚𝐝𝐨𝐭𝐭𝐚𝐫𝐞!\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨: ${usedPrefix}𝐚𝐝𝐨𝐭𝐭𝐚 @tag`
  if (mention === m.sender) throw '🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐚𝐝𝐨𝐭𝐭𝐚𝐫𝐞 𝐭𝐞 𝐬𝐭𝐞𝐬𝐬𝐨!'

  let destinatario = users[mention]
  if (!destinatario) throw '❌ 𝐔𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨 𝐧𝐞𝐥 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞.'

  if (user.figli && user.figli.includes(mention))
    throw `👨‍👧 𝐇𝐚𝐢 𝐠𝐢à 𝐚𝐝𝐨𝐭𝐭𝐚𝐭𝐨 @${mention.split('@')[0]}!`

  if (destinatario.genitori && destinatario.genitori.includes(m.sender))
    throw `👶 @${mention.split('@')[0]} è 𝐠𝐢à 𝐭𝐮𝐨 𝐟𝐢𝐠𝐥𝐢𝐨!`

  if (adoptions[m.sender] || adoptions[mention])
    throw `⏳ 𝐔𝐧𝐚 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚 𝐝𝐢 𝐚𝐝𝐨𝐳𝐢𝐨𝐧𝐞 è 𝐠𝐢à 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨.`

  const adoptionId = Date.now().toString()

  adoptions[mention] = { from: m.sender, timeout: null, id: adoptionId, to: mention }
  adoptions[m.sender] = { to: mention, timeout: null, id: adoptionId, from: m.sender }

  let testo = `👨‍👧 𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚 𝐝𝐢 𝐚𝐝𝐨𝐳𝐢𝐨𝐧𝐞:\n\n@${mention.split('@')[0]}, 𝐯𝐮𝐨𝐢 𝐞𝐬𝐬𝐞𝐫𝐞 𝐚𝐝𝐨𝐭𝐭𝐚𝐭𝐨/𝐚 𝐝𝐚 @${m.sender.split('@')[0]}?\n\n⏳ 𝐇𝐚𝐢 𝟔𝟎 𝐬𝐞𝐜𝐨𝐧𝐝𝐢 𝐩𝐞𝐫 𝐬𝐜𝐞𝐠𝐥𝐢𝐞𝐫𝐞.`

  let buttons = [
    { buttonId: `accettaadozione_${adoptionId}`, buttonText: { displayText: '✅ 𝐀𝐜𝐜𝐞𝐭𝐭𝐚' }, type: 1 },
    { buttonId: `rifiutaadozione_${adoptionId}`, buttonText: { displayText: '❌ 𝐑𝐢𝐟𝐢𝐮𝐭𝐚' }, type: 1 }
  ]

  await conn.sendMessage(m.chat, {
    text: testo,
    buttons,
    mentions: [mention, m.sender],
    headerType: 1
  }, { quoted: m })

  const timeoutCallback = () => {
    if (adoptions[mention] && adoptions[mention].id === adoptionId) {
      conn.sendMessage(m.chat, {
        text: `⏳ 𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚 𝐝𝐢 𝐚𝐝𝐨𝐳𝐢𝐨𝐧𝐞 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐭𝐚:\n@${m.sender.split('@')[0]} 𝐞 @${mention.split('@')[0]} 𝐧𝐨𝐧 𝐡𝐚𝐧𝐧𝐨 𝐫𝐢𝐬𝐩𝐨𝐬𝐭𝐨 𝐞𝐧𝐭𝐫𝐨 𝐢𝐥 𝐭𝐞𝐦𝐩𝐨.`,
        mentions: [m.sender, mention]
      })
      delete adoptions[mention]
      delete adoptions[m.sender]
    }
  }

  const timeoutId = setTimeout(timeoutCallback, 60000)
  adoptions[mention].timeout = timeoutId
  adoptions[m.sender].timeout = timeoutId
}

handler.before = async (m) => {
  if (!m.message || !m.message.buttonsResponseMessage) return
  let response = m.message.buttonsResponseMessage.selectedButtonId
  let sender = m.sender

  const adoptionEntry = Object.entries(adoptions).find(([key, val]) =>
    val.to === sender)

  if (!adoptionEntry) return

  const [adoptionKey, adoptionData] = adoptionEntry
  const { id, from, to, timeout } = adoptionData

  if (!response.includes(id)) return
  if (sender !== to) return

  clearTimeout(timeout)

  let fromUser = from
  let toUser = to

  let mittente = global.db.data.users[fromUser]
  let ricevente = global.db.data.users[toUser]

  if (response.includes('rifiutaadozione')) {
    delete adoptions[fromUser]
    delete adoptions[toUser]
    return m.reply(`❌ @${toUser.split('@')[0]} 𝐡𝐚 𝐫𝐢𝐟𝐢𝐮𝐭𝐚𝐭𝐨 𝐥'𝐚𝐝𝐨𝐳𝐢𝐨𝐧𝐞.`, null, { mentions: [fromUser] })
  }

  if (response.includes('accettaadozione')) {
    if (!mittente.figli) mittente.figli = []
    if (!ricevente.genitori) ricevente.genitori = []

    mittente.figli.push(toUser)
    ricevente.genitori.push(fromUser)

    delete adoptions[fromUser]
    delete adoptions[toUser]

    return m.reply(`👨‍👧‍👦 @${toUser.split('@')[0]} è 𝐬𝐭𝐚𝐭𝐨 𝐚𝐝𝐨𝐭𝐭𝐚𝐭𝐨 𝐝𝐚 @${fromUser.split('@')[0]}!`, null, {
      mentions: [fromUser, toUser]
    })
  }
}

const handleAbbandona = async (m, user, users, conn) => {
  let mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null)

  if (mention && !mention.includes('@')) mention += '@s.whatsapp.net'

  if (!mention) throw '⚠️ 𝐓𝐚𝐠𝐠𝐚 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐝𝐚 𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚𝐫𝐞.\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨: .𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚 @𝐮𝐭𝐞𝐧𝐭𝐞'

  let target = users[mention]
  if (!target) throw '❌ 𝐔𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.'

  let relazione = false
  if (user.figli && user.figli.includes(mention)) {
    user.figli = user.figli.filter(f => f !== mention)
    target.genitori = (target.genitori || []).filter(g => g !== m.sender)
    relazione = true
  } else if (user.genitori && user.genitori.includes(mention)) {
    user.genitori = user.genitori.filter(g => g !== mention)
    target.figli = (target.figli || []).filter(f => f !== m.sender)
    relazione = true
  }

  if (!relazione)
    throw `❌ 𝐍𝐨𝐧 𝐬𝐞𝐢 𝐢𝐧 𝐮𝐧𝐚 𝐫𝐞𝐥𝐚𝐳𝐢𝐨𝐧𝐞 𝐝𝐢 𝐚𝐝𝐨𝐳𝐢𝐨𝐧𝐞 𝐜𝐨𝐧 @${mention.split('@')[0]}`

  await conn.sendMessage(m.chat, {
    text: `💔 @${m.sender.split('@')[0]} 𝐡𝐚 𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚𝐭𝐨 @${mention.split('@')[0]}.`,
    mentions: [m.sender, mention]
  })
}

handler.command = ['adotta', 'abbandona']
handler.group = true

export default handler