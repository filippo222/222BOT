import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format)) throw new Error('Formato non supportato.');

    const { data } = await axios.get(`https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (data?.success) {
      return {
        id: data.id,
        title: data.title,
        downloadUrl: await ddownr.cekProgress(data.id)
      };
    } else {
      throw new Error('Errore nel recupero dei dettagli del video.');
    }
  },

  cekProgress: async (id) => {
    while (true) {
      const { data } = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (data?.success && data.progress === 1000) return data.download_url;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
};

const handler = async (m, { conn, text, command }) => {
  if (!text.trim()) return conn.reply(m.chat, `𝐢𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥𝐥𝐚 𝐦𝐮𝐬𝐢𝐜𝐚 𝐜𝐡𝐞 𝐯𝐮𝐨𝐢 𝐚𝐬𝐜𝐨𝐥𝐭𝐚𝐫𝐞 𝐭𝐫𝐚𝐦𝐢𝐭𝐞 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 [.𝐩𝐥𝐚𝐲 <𝐧𝐨𝐦𝐞 𝐜𝐚𝐧𝐳𝐨𝐧𝐞 + 𝐚𝐫𝐭𝐢𝐬𝐭𝐚>] 🎶`, m);

  const search = await yts(text);
  if (!search.all.length) return m.reply('Nessun risultato trovato.');

  const videoInfo = search.all[0];
  const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;

  const infoMessage = `
> 𝚯𝑴𝜩𝑹𝑻𝚲𝟒𝟕『👑』𝐁𝚯𝐓 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝
⭐ *Titolo:* ${title}
⏳ *Durata:* ${timestamp}
👁️ *Visualizzazioni:* ${new Intl.NumberFormat().format(views)}
📺 *Canale:* ${author?.name || 'Sconosciuto'}
📅 *Pubblicato:* ${ago}
> *invio audio in corso...*`;

 
  await conn.sendMessage(m.chat, {
  image: { url: thumbnail }, caption: infoMessage, quoted: m })

 
  const api = await ddownr.download(url, 'mp3');

  await conn.sendMessage(m.chat, {
    audio: { url: api.downloadUrl },
    mimetype: 'audio/mpeg'
  }, { quoted: m });
};

handler.command = ['play'];
handler.tags = ['downloader'];
handler.help = ['play'];

export default handler;