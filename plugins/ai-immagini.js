import axios from "axios";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB limite WhatsApp

var handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) {
    await m.reply("❗ Per favore, scrivi una descrizione per generare l'immagine.");
    return;
  }

  try {
    await conn.sendPresenceUpdate("composing", m.chat);
    await m.reply("⏳ Sto creando l'immagine...");

    const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(text)}`;

    const response = await axios.get(apiUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    if (!response.data) {
      return m.reply("❌ L'API non ha restituito un'immagine valida. Riprova più tardi.");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    if (imageBuffer.length > MAX_IMAGE_SIZE) {
      return m.reply("⚠️ L'immagine è troppo grande da inviare direttamente. Prova un prompt più breve.");
    }

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `✨ Immagine generata da 𝐒𝐯𝐨²²² 𝐁𝚯𝐓 🚀\n🖼️ Prompt: *${text}*`
    }, { quoted: m });

  } catch (error) {
    console.error("Errore generazione immagine:", error);

    let errMsg = "❌ Si è verificato un errore sconosciuto.";
    if (error.code === 'ECONNABORTED') {
      errMsg = "❌ Timeout nella richiesta. Riprova più tardi.";
    } else if (error.response?.data?.message) {
      errMsg = `❌ Errore API: ${error.response.data.message}`;
    } else if (error.message) {
      errMsg = `❌ Errore: ${error.message}`;
    }
    await m.reply(errMsg);
  }
};

handler.command = ["img"];

export default handler;