import fs from 'fs'
import path from 'path'

const DATA_DIR = './data_rank'
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR)

const getFilePath = (chatId) => path.join(DATA_DIR, `${chatId}.json`)

const loadData = (chatId) => {
  try {
    const filePath = getFilePath(chatId)
    if (!fs.existsSync(filePath)) return {
      enabled: false,
      users: {},
      settings: { ignoreCommands: true }
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (e) {
    console.error('Errore caricamento dati:', e)
    return {
      enabled: false,
      users: {},
      settings: { ignoreCommands: true }
    }
  }
}

const getTodayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

const getWeekKey = () => {
  const d = new Date()
  const onejan = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${week}`
}

const getMonthKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}`
}

const handler = async (m, { conn, command }) => {
  const chatId = m.chat
  const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  const target = mention

  const rankData = loadData(chatId)
  if (!rankData.enabled) return m.reply('⚠️ Il ranking non è attivo in questo gruppo!')

  const userData = rankData.users[target] || {
    total: 0,
    [getTodayKey()]: 0,
    [getWeekKey()]: 0,
    [getMonthKey()]: 0
  }

  const stats = {
    oggi: userData[getTodayKey()] || 0,
    settimana: userData[getWeekKey()] || 0,
    mese: userData[getMonthKey()] || 0,
    totale: userData.total || 0,
    livello: Math.floor(userData.total / 500),
    prossimoLivello: (Math.floor(userData.total / 500) + 1) * 500,
    mancanti: (Math.floor(userData.total / 500) + 1) * 500 - userData.total
  }

  // Calcola posizione in classifica
  const utentiClassifica = Object.entries(rankData.users || {})
    .map(([id, u]) => ({ id, total: u.total || 0 }))
    .sort((a, b) => b.total - a.total)

  const posizione = utentiClassifica.findIndex(u => u.id === target) + 1 || '-'
  const totaleUtenti = utentiClassifica.length

  // Formattazione del profilo (stile tuo originale)
  const profileText = `
╔═══ *PROFILO UTENTE* ═══╗
║
║ 🆔 @${target.split('@')[0]}
║ 🏅 Posizione: ${posizione}/${totaleUtenti}
║ 📊 Livello: ${stats.livello}
║
║ 📈 *STATISTICHE MESSAGGI*
║ 📅 Oggi: ${stats.oggi}
║ 📆 Questa settimana: ${stats.settimana}
║ 🗓️ Questo mese: ${stats.mese}
║ 🏆 Totali: ${stats.totale}
║
║ 🎯 Prossimo livello: ${stats.prossimoLivello}
║ ⏳ Mancano: ${stats.mancanti} messaggi
║
╚══════════════╝
`.trim()

  const buttons = [
    {
      buttonId: '.rankoggi',
      buttonText: { displayText: '📊 Classifica Oggi' },
      type: 1
    },
    {
      buttonId: '.ranksettimana',
      buttonText: { displayText: '📈 Classifica Settimana' },
      type: 1
    },
    {
      buttonId: '.rankmese',
      buttonText: { displayText: '📅 Classifica Mese' },
      type: 1
    },
    {
      buttonId: '.ranktotale',
      buttonText: { displayText: '🏆 Classifica Totale' },
      type: 1
    }
  ]

  await conn.sendMessage(m.chat, {
    text: profileText,
    footer: 'Seleziona una classifica:',
    buttons: buttons,
    mentions: [target]
  }, { quoted: m })
}

handler.command = /^(profilo|profile|stats|statistiche)$/i
handler.tags = ['group']
handler.help = [
  '!profilo [@utente] - Mostra le statistiche complete',
  '!profile - Versione inglese del comando',
  '!stats - Visualizza le tue statistiche'
]

export default handler