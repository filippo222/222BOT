import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path' 
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const USERS_FILE = path.join(__dirname, '..', 'lastfm_users.json')

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '{}', 'utf8')
}

function loadUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

function getLastfmUsername(userId) {
  const users = loadUsers()
  return users[userId] || null
}

function setLastfmUsername(userId, username) {
  const users = loadUsers()
  users[userId] = username
  saveUsers(users)
}

const LASTFM_API_KEY = '36f859a1fc4121e7f0e931806507d5f9'

async function getRecentTrack(username) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
  const res = await fetch(url)
  const json = await res.json()
  return json?.recenttracks?.track?.[0]
}

async function getRecentTracks(username, limit = 10) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&limit=${limit}`
  const res = await fetch(url)
  const json = await res.json()
  return json?.recenttracks?.track || []
}

async function getTopArtists(username, period = '7day', limit = 9) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${LASTFM_API_KEY}&format=json&period=${period}&limit=${limit}`
  const res = await fetch(url)
  const json = await res.json()
  return json?.topartists?.artist
}

async function getTopAlbums(username, period = '7day', limit = 9) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${LASTFM_API_KEY}&format=json&period=${period}&limit=${limit}`
  const res = await fetch(url)
  const json = await res.json()
  return json?.topalbums?.album
}

const handler = async (m, { conn, args, usedPrefix, text, command }) => {
  if (command === 'setuser') {
    const username = text.trim()
    if (!username) {
      await conn.sendMessage(m.chat, {
        text: `❌ Usa il comando così: ${usedPrefix}setuser <username>`
      })
      return
    }

    setLastfmUsername(m.sender, username)
    await conn.sendMessage(m.chat, {
      text: `✅ Username *${username}* salvato!`
    })
    return
  }

  const user = getLastfmUsername(m.sender)
  if (!user) {
    await conn.sendMessage(m.chat, {
      text: `🎵 *Registrazione Last.fm richiesta*\n\n@${m.sender.split('@')[0]}, per usare i comandi musicali devi registrare il tuo username Last.fm.\n\n📱 *Usa questo comando:*\n${usedPrefix}setuser <tuo_username>`,
      mentions: [m.sender]
    })
    return
  }

  const parseOptions = (text) => {
    let size = 3
    let period = '7day'
    const sizeMatch = text.match(/(\d)x\1/)
    const periodMatch = text.match(/(7day|1month|3month|6month|12month|overall)/i)
    if (sizeMatch) size = parseInt(sizeMatch[1])
    if (periodMatch) period = periodMatch[1].toLowerCase()
    return { size, period }
  }

  if (command === 'cur') {
    const track = await getRecentTrack(user)
    if (!track) {
      return conn.sendMessage(m.chat, { text: '❌ Nessuna traccia trovata.' })
    }

    const nowPlaying = track['@attr']?.nowplaying === 'true'
    const artist = track.artist?.['#text'] || 'Artista sconosciuto'
    const title = track.name || 'Brano sconosciuto'
    const album = track.album?.['#text'] || 'Album sconosciuto'
    const image = track.image?.find(img => img.size === 'extralarge')?.['#text'] || null

    const caption = nowPlaying
      ? `🎧 *In riproduzione da @${m.sender.split('@')[0]}*\n\n🎵 *${title}*\n🎤 ${artist}\n💿 ${album}`
      : `⏹️ *Ultimo brano ascoltato da @${m.sender.split('@')[0]}*\n\n🎵 *${title}*\n🎤 ${artist}\n💿 ${album}`

    const msg = image
      ? { image: { url: image }, caption, mentions: conn.parseMention(caption) }
      : { text: caption }

    await conn.sendMessage(m.chat, msg, { quoted: m })
    return
  }

  if (command === 'topartists') {
    const { size, period } = parseOptions(text)
    const artists = await getTopArtists(user, period, size * size)
    if (!artists?.length) {
      return conn.sendMessage(m.chat, { text: '❌ Nessun artista trovato.' })
    }

    const list = artists.map((a, i) =>
      `${i + 1}. *${a.name}* (${a.playcount} play)`
    ).join('\n')

    await conn.sendMessage(m.chat, {
      text: `🎨 *Top ${artists.length} artisti di ${user}* (${period})\n\n${list}`
    }, { quoted: m })

    return
  }

  if (command === 'topalbums') {
    const { size, period } = parseOptions(text)
    const albums = await getTopAlbums(user, period, size * size)
    if (!albums?.length) {
      return conn.sendMessage(m.chat, { text: '❌ Nessun album trovato.' })
    }

    const list = albums.map((a, i) =>
      `${i + 1}. *${a.name}* – ${a.artist?.name || 'Sconosciuto'} (${a.playcount} play)`
    ).join('\n')

    await conn.sendMessage(m.chat, {
      text: `📀 *Top ${albums.length} album di ${user}* (${period})\n\n${list}`
    }, { quoted: m })

    return
  }

  if (command === 'cronologia') {
    const tracks = await getRecentTracks(user, 10)
    if (!tracks.length) {
      return conn.sendMessage(m.chat, { text: '❌ Nessuna cronologia trovata.' })
    }

    const trackList = tracks.map((track, i) => {
      const icon = track['@attr']?.nowplaying === 'true' ? '▶️' : `${i + 1}.`
      return `${icon} ${track.name}\n   🎤 ${track.artist['#text']}`
    }).join('\n\n')

    await conn.sendMessage(m.chat, {
      text: `📜 *Cronologia ascolti di ${user}*\n\n${trackList}`
    })

    return
  }
}

handler.command = ['setuser', 'cur', 'topartists', 'topalbums', 'cronologia']
handler.group = true

export default handler