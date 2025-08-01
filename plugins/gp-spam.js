let handler = async (m, { conn, args, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return m.reply('❌ Questo comando funziona solo nei gruppi.')
  if (!isAdmin) return m.reply('❌ Solo gli admin possono usare questo comando.')
  if (!isBotAdmin) return m.reply('❌ Devo essere admin per inviare messaggi nel gruppo.')

  let count = parseInt(args[0])
  if (isNaN(count) || count < 1 || count > 20) return m.reply('❌ Usa un numero tra 1 e 20.')

  let text = args.slice(1).join(' ')
  if (!text && m.quoted) {
    text = m.quoted.text || m.quoted.caption || '📎 Messaggio allegato'
  }

  if (!text) return m.reply('❌ Inserisci un testo o rispondi a un messaggio.')

  // 📌 Estrai numeri tipo @39... per menzionarli
  const mentionJids = Array.from(new Set(
    [...text.matchAll(/@(\d{8,})/g)].map(v => v[1] + '@s.whatsapp.net')
  ))

  for (let i = 0; i < count; i++) {
    await conn.sendMessage(m.chat, { text, mentions: mentionJids }, { quoted: m.quoted || m })
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

handler.help = ['spam <volte> <testo>']
handler.tags = ['tools']
handler.command = ['spam']
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler