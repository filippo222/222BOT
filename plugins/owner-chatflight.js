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
      excluded: [],
      settings: {
        resetOnNewPeriod: true,
        excludeAdmins: false
      }
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return {
      enabled: data.enabled !== undefined ? data.enabled : false,
      users: data.users || {},
      excluded: data.excluded || [],
      settings: {
        resetOnNewPeriod: data.settings?.resetOnNewPeriod !== false,
        excludeAdmins: data.settings?.excludeAdmins || false
      }
    }
  } catch (e) {
    console.error('Errore caricamento dati:', e)
    return {
      enabled: false,
      users: {},
      excluded: [],
      settings: {
        resetOnNewPeriod: true,
        excludeAdmins: false
      }
    }
  }
}

const saveData = (chatId, data) => {
  fs.writeFileSync(getFilePath(chatId), JSON.stringify(data, null, 2))
}

const getTodayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
}

const handler = async (m, { conn, command, text, participants }) => {
  const chatId = m.chat
  if (!chatId.endsWith('@g.us')) return m.reply('⚠️ Solo per gruppi!')

  const data = loadData(chatId)
  const mention = m.mentionedJid?.[0] || (text.match(/\d{10,}/)?.[0] + '@s.whatsapp.net')
  const isAdmin = participants.find(p => p.id === m.sender)?.admin || false

  // Funzione per ottenere il nome formattato
  const getName = async (jid) => {
    try {
      const contact = await conn.getName(jid)
      return contact || jid.split('@')[0]
    } catch {
      return jid.split('@')[0]
    }
  }

  // Pulsanti avanzati con menu a tendina
  const generateButtons = (options) => {
    const rows = options.map(opt => ({
      title: opt.text,
      description: opt.desc,
      rowId: `.${opt.cmd}${opt.param ? ' ' + opt.param : ''}`
    }))
    
    return conn.sendMessage(m.chat, {
      text: '📊 Menu Gestione Ranking',
      footer: 'Seleziona un\'opzione',
      title: 'Opzioni Disponibili',
      buttonText: 'Apri Menu',
      sections: [{
        title: 'Gestione Utenti',
        rows: rows
      }]
    }, { quoted: m })
  }

  // Comando principale
  if (command === 'rankadmin') {
    return generateButtons([
      { text: '🚫 Escludi Utente', desc: 'Escludi dal ranking', cmd: 'escludi' },
      { text: '✅ Riabilita Utente', desc: 'Riabilita nel ranking', cmd: 'riabilita' },
      { text: '📋 Lista Esclusi', desc: 'Mostra utenti esclusi', cmd: 'esclusi' },
      { text: '🔄 Resetta Statistiche', desc: 'Azzera i conteggi', cmd: 'resetta' },
      { text: '⚙️ Impostazioni', desc: 'Configura il ranking', cmd: 'ranksettings' }
    ])
  }

  // Gestione esclusione
  if (command === 'escludi') {
    if (!mention) return m.reply('ℹ️ Menziona un utente o rispondi al suo messaggio\nEs: !escludi @utente')
    
    const targetIsAdmin = participants.find(p => p.id === mention)?.admin || false
    if (targetIsAdmin && !data.settings.excludeAdmins) {
      return m.reply('⚠️ Non puoi escludere un admin! Modifica le impostazioni con !ranksettings')
    }

    if (data.excluded.includes(mention)) return m.reply('⚠️ Utente già escluso!')
    
    data.excluded.push(mention)
    saveData(chatId, data)
    
    const name = await getName(mention)
    return conn.sendMessage(m.chat, {
      text: `✅ Utente @${mention.split('@')[0]} (${name}) escluso dal ranking!`,
      mentions: [mention]
    }, { quoted: m })
  }

  // Gestione riabilitazione
  if (command === 'riabilita') {
    if (!mention) return m.reply('ℹ️ Menziona un utente o rispondi al suo messaggio\nEs: !riabilita @utente')
    
    if (!data.excluded.includes(mention)) return m.reply('⚠️ Utente non escluso!')
    
    data.excluded = data.excluded.filter(id => id !== mention)
    saveData(chatId, data)
    
    const name = await getName(mention)
    return conn.sendMessage(m.chat, {
      text: `✅ Utente @${mention.split('@')[0]} (${name}) riabilitato nel ranking!`,
      mentions: [mention]
    }, { quoted: m })
  }

  // Lista utenti esclusi
  if (command === 'esclusi') {
    if (data.excluded.length === 0) return m.reply('ℹ️ Nessun utente escluso')
    
    const list = await Promise.all(data.excluded.map(async jid => {
      const name = await getName(jid)
      return `• @${jid.split('@')[0]} (${name})`
    }))
    
    return conn.sendMessage(m.chat, {
      text: `📋 Utenti esclusi:\n${list.join('\n')}`,
      mentions: data.excluded
    }, { quoted: m })
  }

  // Reset statistiche
  if (command === 'resetta') {
    if (!mention) {
      // Reset globale
      if (text.toLowerCase() === 'tutto') {
        data.users = {}
        data.excluded = []
        saveData(chatId, data)
        return m.reply('✅ Tutte le statistiche e esclusioni sono state azzerate!')
      }
      return m.reply('ℹ️ Usa:\n!resetta @utente\n!resetta tutto')
    }
    
    if (!data.users[mention]) return m.reply('⚠️ Utente senza statistiche!')
    
    // Reset completo dell'utente
    data.users[mention] = { 
      total: 0,
      [getTodayKey()]: 0
    }
    saveData(chatId, data)
    
    const name = await getName(mention)
    return conn.sendMessage(m.chat, {
      text: `✅ Statistiche di @${mention.split('@')[0]} (${name}) azzerate!`,
      mentions: [mention]
    }, { quoted: m })
  }

  // Impostazioni avanzate
  if (command === 'ranksettings') {
    if (!text) {
      return generateButtons([
        { text: '🔄 Auto Reset', desc: `Stato: ${data.settings.resetOnNewPeriod ? 'ON' : 'OFF'}`, cmd: 'ranksettings reset' },
        { text: '👑 Escludi Admin', desc: `Stato: ${data.settings.excludeAdmins ? 'ON' : 'OFF'}`, cmd: 'ranksettings admins' }
      ])
    }

    if (text.includes('reset')) {
      data.settings.resetOnNewPeriod = !data.settings.resetOnNewPeriod
      saveData(chatId, data)
      return m.reply(`✅ Auto reset giornaliero ${data.settings.resetOnNewPeriod ? 'attivato' : 'disattivato'}!`)
    }

    if (text.includes('admins')) {
      if (!isAdmin) return m.reply('⚠️ Solo gli admin possono modificare questa impostazione!')
      data.settings.excludeAdmins = !data.settings.excludeAdmins
      saveData(chatId, data)
      return m.reply(`✅ Esclusione admin ${data.settings.excludeAdmins ? 'attivata' : 'disattivata'}!`)
    }
  }
}

handler.command = /^(rankadmin|escludi|riabilita|esclusi|resetta|ranksettings)$/i
handler.tags = ['group-admin']
handler.help = [
  '!rankadmin - Menu gestione ranking',
  '!escludi @utente - Escludi dal ranking',
  '!riabilita @utente - Riabilita nel ranking',
  '!esclusi - Mostra utenti esclusi',
  '!resetta @utente - Azzera statistiche utente',
  '!resetta tutto - Azzera tutto',
  '!ranksettings - Impostazioni avanzate'
]
handler.group = true

handler.owner = true

export default handler