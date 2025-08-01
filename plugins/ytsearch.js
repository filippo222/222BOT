import ytSearch from 'yt-search';
import fs from 'fs';

const handler = async (m, { conn: conn, text: text }) => {
    const requiredFiles = [
        './CODE_OF_CONDUCT.md',
        './bal.png',
        './termini.jpeg',
        './plugins/OWNER_file.js'
    ];
    
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    if (missingFiles.length) {
        return await conn.sendMessage(m.chat, { 
            text: '❗ Per usare questo comando usa la base di filo' 
        }, { quoted: m });
    }

    if (!text?.trim()) {
        return await conn.sendMessage(m.chat, { 
            text: '📌 Inserisci il nome del video da cercare.\nEsempio: .ytsearch mai una gioia compilation' 
        }, { quoted: m });
    }

    const chatId = m.chat;
    const searchResults = await ytSearch(text);
    const videos = searchResults.videos.slice(0, 5);

    if (!videos.length) {
        return m.reply('❌ Nessun risultato trovato.', m);
    }

    const videoCards = videos.map(video => ({
        image: { url: video.thumbnail },
        title: video.title,
        body: `📺 *Durata:* ${video.timestamp}\n👁 *Visualizzazioni:* ${video.views.toLocaleString()}\n👤 *Canale:* ${video.author.name}`,
        footer: '𝟐𝟐𝟐 𝐁𝚯𝐓 ✦ Downloader'
    }));

    await conn.sendMessage(chatId, {
        text: '🎬 Ecco i risultati della tua ricerca:',
        title: '🔎 YouTube Search',
        footer: '𝟐𝟐𝟐 𝐁𝚯𝐓 ✦ Downloader',
        cards: videoCards
    }, { quoted: m });

    const buttons = videos.map((video, index) => ({
        buttonId: '.ytformat ' + index,
        buttonText: { displayText: '' + (index + 1) },
        type: 1
    }));

    await conn.sendMessage(chatId, {
        text: '🔢 Seleziona un video dai risultati sopra per scegliere il formato da scaricare:',
        footer: '𝟐𝟐𝟐 𝐁𝚯𝐓 ✦ Downloader',
        buttons: buttons,
        headerType: 1
    }, { quoted: m });

    conn.ytCache = conn.ytCache || {};
    conn.ytCache[chatId] = videos;
};

handler.tags = ['downloader'];
handler.command = ['ytsearch'];
handler.help = ['ytsearch <titolo>'];

export default handler;