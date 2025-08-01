import fetch from 'node-fetch';
import { writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function downloadAudio(url, filepath) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  if (!res.ok) throw new Error(`Errore download audio: ${res.statusText}`);
  const buffer = await res.arrayBuffer();
  writeFileSync(filepath, Buffer.from(buffer));
}

var handler = async (m, { text, usedPrefix, command, conn }) => {
  try {
    if (!text) text = "Che cazzo vuoi?";

    conn.sendPresenceUpdate('recording', m.chat);

    const voiceCode = "it_male_m18";
    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/TikTok-Voices?text=${encodeURIComponent(text)}&voice=${voiceCode}`;

    // Chiedi all'API (risposta JSON con link audio)
    const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`Errore API: ${res.statusText}`);

    const data = await res.json();

    if (!data.url && !data.audioUrl) throw new Error("Nessun link audio ricevuto");

    const audioUrl = data.url || data.audioUrl;

    const tempFile = join(__dirname, '../tmp', `${Date.now()}.mp3`);

    // Scarica audio dal link
    await downloadAudio(audioUrl, tempFile);

    // Invia il file audio
    await conn.sendFile(m.chat, tempFile, 'risposta.mp3', null, m, true);

    // Pulisci file temporaneo
    try { unlinkSync(tempFile); } catch {}

  } catch (e) {
    await conn.reply(m.chat, `Errore: ${e.message}`, m);
    console.error(e);
  }
};

handler.command = ['vocale', 'voce', 'tts'];
handler.help = ['vocale <testo>'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;
