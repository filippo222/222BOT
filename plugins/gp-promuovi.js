let whitelist = [
  '393201448716@s.whatsapp.net',  // esempio
  
]

// Il tuo numero (owner) in formato jid completo:
const ownerJid = '393201448716@s.whatsapp.net'

// Helper per formattare input vari in jid
function toJid(input) {
  if (!input) return null
  input = input.trim()

  // Se è menzione tipo @1234567890
  if (input.startsWith('@')) {
    input = input.slice(1)
  }

  // Se è jid completo
  if (input.endsWith('@s.whatsapp.net')) {
    return input.toLowerCase()
  }

  // Se è solo numero (puliamo da caratteri non numerici)
  const number = input.replace(/[^0-9]/g, '')
  if (number.length >= 11 && number.length <= 13) {
    return number + '@s.whatsapp.net'
  }

  return null
}

let handler = async (m, { conn, text, mentionedJid, args, command }) => {
  const sender = m.sender.replace(/@c\.us$/, '@s.whatsapp.net').toLowerCase()

  // Comandi .p e .r richiedono whitelist
  if (command === 'p' || command === 'r') {
    if (!whitelist.some(jid => jid.toLowerCase() === sender)) {
      throw '*❗ Non sei autorizzato a usare questo comando!*'
    }

    if (!text && !(mentionedJid || []).length && !m.quoted)
      throw `*❗ Devi menzionare o rispondere a un utente!*`

    let users = []

    if ((mentionedJid || []).length) {
      users = mentionedJid
    } else if (m.quoted) {
      users = [m.quoted.sender]
    } else if (args.length) {
      for (let arg of args) {
        const jid = toJid(arg)
        if (jid) users.push(jid)
      }
    }

    if (!users.length) throw `*❗ Nessun utente valido trovato!*`

    let action = command === 'p' ? 'promote' : 'demote'

    for (let user of users) {
      await conn.groupParticipantsUpdate(m.chat, [user], action).catch(() => {})
    }
    return
  }

  // Comando .wp per gestire whitelist — SOLO OWNER
  if (command === 'wp') {
    if (sender !== ownerJid.toLowerCase()) {
      throw '*❗ Solo il proprietario del bot può gestire la whitelist!*'
    }

    if (args.length === 0) {
      throw '*❗ Usa: .wp add <numero|jid|@mention>, .wp remove <numero|jid|@mention> o .wp list*'
    }

    const subcommand = args[0].toLowerCase()

    if (subcommand === 'add') {
      if (args.length < 2) throw '*❗ Specifica un numero, jid o menzione da aggiungere!*'
      const jid = toJid(args[1])
      if (!jid) throw '*❗ Input non valido!*'

      if (whitelist.includes(jid)) {
        return m.reply(`*❗ Il numero ${jid.replace(/@s\.whatsapp\.net$/, '')} è già nella whitelist!*`)
      }
      whitelist.push(jid)
      return m.reply(`*✅ Numero ${jid.replace(/@s\.whatsapp\.net$/, '')} aggiunto alla whitelist!*`)
    }

    else if (subcommand === 'remove') {
      if (args.length < 2) throw '*❗ Specifica un numero, jid o menzione da rimuovere!*'
      const jid = toJid(args[1])
      if (!jid) throw '*❗ Input non valido!*'

      if (!whitelist.includes(jid)) {
        return m.reply(`*❗ Il numero ${jid.replace(/@s\.whatsapp\.net$/, '')} non è nella whitelist!*`)
      }
      whitelist = whitelist.filter(x => x !== jid)
      return m.reply(`*✅ Numero ${jid.replace(/@s\.whatsapp\.net$/, '')} rimosso dalla whitelist!*`)
    }

    else if (subcommand === 'list') {
      if (whitelist.length === 0) return m.reply('*❗ La whitelist è vuota!*')

      const list = whitelist.map(jid => jid.replace(/@s\.whatsapp\.net$/, '')).join('\n')
      return m.reply(`*📋 Lista whitelist:*\n${list}`)
    }

    else {
      throw '*❗ Comando non valido! Usa add, remove o list*'
    }
  }
}

handler.command = /^(p|r|wp)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler