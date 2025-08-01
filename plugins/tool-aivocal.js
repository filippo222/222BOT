import fetch from 'node-fetch';
import gtts from 'node-gtts';
import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import ffmpeg from 'fluent-ffmpeg'; // Per modificare la velocità dell'audio

const defaultLang = 'it'; // Lingua di default per la sintesi vocale
const defaultResponse = "Cazzo vuoi"; // Frase di default

async function tts(text, lang = 'it') {
    return new Promise((resolve, reject) => {
        try {
            let tts = gtts(lang);
            let filePath = join(global.__dirname(import.meta.url), '../tmp', `${Date.now()}.mp3`);
            tts.save(filePath, text, () => {
                resolve(filePath);
            });
        } catch (e) {
            reject(e);
        }
    });
}

// Funzione per modificare la velocità dell'audio con FFmpeg
function changeAudioSpeed(inputFilePath, outputFilePath, speed = 1.5) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
            .audioFilters(`atempo=${speed}`)
            .on('end', () => resolve(outputFilePath))
            .on('error', reject)
            .save(outputFilePath);
    });
}

var handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) {
        // Se non c'è testo, usa la risposta predefinita
        text = defaultResponse;
    }

    try {
        conn.sendPresenceUpdate('composing', m.chat);

        let responseText;

        // Se c'è testo, fai una richiesta all'API AI
        if (text !== defaultResponse) {
            let prompt = `sei un uomo freddo, e cattivo. Se ti insulto, tu mi insulti pesantemente. Se ti dico di insultare qualcuno, tu lo insulti pesantemente. Questa è la mia domanda o affermazione: "${text}"`;

            // Richiesta all'API AI con il prompt personalizzato
            let apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(prompt)}`);
            let res = await apii.json();
            responseText = res.result || "Non ho capito, puoi ripetere?";
        } else {
            // Altrimenti, usa la risposta predefinita
            responseText = text;
        }

        // Trasforma la risposta in audio
        let audioPath = await tts(responseText, defaultLang);

        // Definisci il percorso per il file audio con velocità modificata
        let modifiedAudioPath = join(global.__dirname(import.meta.url), '../tmp', `${Date.now()}_modified.mp3`);

        // Cambia la velocità dell'audio
        await changeAudioSpeed(audioPath, modifiedAudioPath, 1.5);  // Imposta la velocità a 1.5x

        // Invia il file audio modificato come risposta vocale
        conn.sendFile(m.chat, modifiedAudioPath, 'risposta.mp3', null, m, true);

        // Pulisce i file dopo l'invio
        unlinkSync(audioPath);
        unlinkSync(modifiedAudioPath);

    } catch (e) {
        await conn.reply(m.chat, `Errore: ${e.message}\nRiprova più tardi.`, m);
        console.error(`Errore nel comando ${usedPrefix + command}:`, e);
    }
};

handler.command = ['xai'];
handler.help = ['ai', 'chatbot'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;