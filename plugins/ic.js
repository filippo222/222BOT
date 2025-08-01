import axios from 'axios'
import fs from 'fs'
import path from 'path'

function normalize(str) {
    if (!str) return ''
    str = str.split(/\s*[\(\[{](?:feat|ft|featuring).*$/i)[0]
               .split(/\s*(?:feat|ft|featuring)\.?\s+.*$/i)[0]
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
}

async function getRandomItalianTrackFromItunes() {

const keywords = [
  // Artisti virali, rapper, trapper, pop-urban
  "Lazza", "Thasup", "Geolier", "Sfera Ebbasta", "Shiva", "Capo Plaza","Tony Effe", "Baby Gang", "Simba La Rue",
  "Rondo Da Sosa", "Paky", "Neima Ezza", "Il Tre" "Anna", "Medy", "Vale Pain", "Nayt", "Salmo", "Guè", "Ernia", "Gemitaiz",
  "Emis Killa", "Villabanks""Tony Boy", "Artie 5ive", "Ghali", "Noyz Narcos","Slings",
  "Niky Savage", "Papa V","Nerissima Serpe", "IL GHOST", 

  // 💿 Produttori famosi, virali o importanti
  "Sick Luke", "Drillionaire", "Night Skinny",
  "Tha Supreme",

  // Nuove leve/underground in hype su TikTok o YouTube
  "Kiid", "Ddusi", "Sadturs", "MILES", "Wairaki"
]
    let found = null
    let tentativi = 0

    while (!found && tentativi < 5) {
        const keyword = keywords[Math.floor(Math.random() * keywords.length)]
        const res = await axios.get('https://itunes.apple.com/search', {
            params: { term: keyword, country: 'IT', media: 'music', limit: 20 }
        })
        const valid = res.data.results.filter(t => t.previewUrl && t.trackName && t.artistName)
        if (valid.length) found = valid[Math.floor(Math.random() * valid.length)]
        tentativi++
    }

    if (!found) throw new Error('Errore nel caricamento della canzone')
    return {
        title: found.trackName,
        artist: found.artistName,
        preview: found.previewUrl
    }
}

const activeGames = new Map()

const handler = async (m, { conn }) => {
    const chat = m.chat

    if (activeGames.has(chat)) return m.reply('▲ _- `C\'è già una partita in corso in questo gruppo!`')

    try {
        const track = await getRandomItalianTrackFromItunes()
        const audioResponse = await axios.get(track.preview, { responseType: 'arraybuffer' })

        const tmpDir = path.join(process.cwd(), 'tmp')
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

        const audioPath = path.join(tmpDir, `song_${Date.now()}.mp3`)
        fs.writeFileSync(audioPath, Buffer.from(audioResponse.data))

        const audioMsg = await conn.sendMessage(chat, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: m })

        fs.unlinkSync(audioPath)

        const formatMessage = (sec) => `
╭─🎧 𝙄𝙉𝘿𝙊𝙑𝙄𝙉𝘼 𝘾𝘼𝙉𝙕𝙊𝙉𝙀 🎧──╮
│ ⏱ Tempo rimasto: *${sec}s*
│ 👤 Artista: *${track.artist}*
│ 📝 Rispondi con il titolo!
╰─────────────────╯`.trim()

        const gameMsg = await conn.reply(chat, formatMessage(30), m)

        const game = {
            track,
            timeLeft: 30,
            message: gameMsg,
            audioMessage: audioMsg,
            interval: null
        }

        game.interval = setInterval(async () => {
            game.timeLeft -= 5

            if (game.timeLeft <= 0) {
                clearInterval(game.interval)
                activeGames.delete(chat)

                await conn.sendMessage(chat, { delete: game.message.key }).catch(() => {})
                await conn.sendMessage(chat, {
                    text: `
╭─⌛ 𝙏𝙀𝙈𝙋𝙊 𝙎𝘾𝘼𝘿𝙐𝙏𝙊!⌛──╮
│ ❌ Nessuno ha indovinato!
│ 🎵 Titolo: *${track.title}*
│ 👤 Artista: *${track.artist}*
╰───────────────╯`,
                    buttons: [{ buttonId: '.ic', buttonText: { displayText: '🔁 Rigioca' }, type: 1 }],
                    headerType: 1
                }).catch(() => {})
            } else {
                await conn.sendMessage(chat, {
                    text: formatMessage(game.timeLeft),
                    edit: game.message.key
                }).catch(() => {})
            }
        }, 5000)

        activeGames.set(chat, game)
    } catch (e) {
        console.error('Errore indovinacanzone:', e)
        m.reply('⚠️ Errore nel gioco. Riprova più tardi.')
        activeGames.delete(chat)
    }
}

handler.before = async (m, { conn }) => {
    const chat = m.chat;
    if (!activeGames.has(chat)) return;

    const game = activeGames.get(chat);

    const quotedId = m.quoted?.key?.id || m.quoted?.id;
    const isReplyToGame = quotedId &&
        (quotedId === game.message?.key?.id || quotedId === game.audioMessage?.key?.id);

    if (!isReplyToGame) return;

    const userAnswer = normalize(m.text || '');
    const correctAnswer = normalize(game.track.title);
    if (!userAnswer || userAnswer.length < 2) return;

    const similarity = (a, b) => {
        const wordsA = a.split(' ');
        const wordsB = b.split(' ');
        const matches = wordsA.filter(w1 => wordsB.some(w2 => w2.includes(w1) || w1.includes(w2)));
        return matches.length / Math.max(wordsA.length, wordsB.length);
    };

    const score = similarity(userAnswer, correctAnswer);
    const isCorrect =
        userAnswer === correctAnswer ||
        (correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length * 0.5) ||
        (userAnswer.includes(correctAnswer) && userAnswer.length < correctAnswer.length * 1.5) ||
        score >= 0.7;

    if (isCorrect) {
        clearInterval(game.interval);
        activeGames.delete(chat);

        let reward = Math.floor(Math.random() * 100) + 50;
        let exp = 500;

        if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {};
        global.db.data.users[m.sender].euro = (global.db.data.users[m.sender].euro || 0) + reward;
        global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) + exp;


        await conn.sendMessage(chat, {
            delete: game.message.key
        }).catch(() => {});

        await conn.sendMessage(chat, {
            text: `
╭─✅ 𝙍𝙄𝙎𝙋𝙊𝙎𝙏𝘼 𝘾𝙊𝙍𝙍𝙀𝙏𝙏𝘼 ✅───╮
│ 🥳 Hai indovinato la canzone!
│ 🎵 Titolo: *${game.track.title}*
│ 👤 Artista: *${game.track.artist}*
│ 💰 Guadagno: *${reward}€*
│ 🌟 Exp: *${exp} XP*
╰──────────────────╯`,
            buttons: [{ buttonId: '.ic', buttonText: { displayText: '🎧 Rigioca' }, type: 1 }],
            headerType: 1
        }, { quoted: m }).catch(() => {});

    } else if (score >= 0.3) {
        await conn.reply(chat, '⏳️ *Ci sei quasi!* Riprova...', m);
    } else {
        await conn.reply(chat, '❌ *Risposta errata!* Riprova o ascolta meglio.', m);
    }
};
handler.help = ['indovinacanzone']
handler.tags = ['giochi']
handler.command = ['indovinacanzone', 'ic']


export default handler