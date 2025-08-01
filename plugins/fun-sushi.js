//questo comando è stato fatto per la mia ragazza 💗
import { performance } from "perf_hooks";

// Funzione per ritardo (delay)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (message, { conn, text }) => {
    // Messaggi personalizzati per il comando Kebab
    let messages = [
        `🍣 Inizio a preparare un Sushi per *${text || "te"}*...`,
        `🔪 Sto tagliando il pesce fresco!`,
        `🍚 Preparo il riso con aceto di riso...`,
        `🥑 Aggiungo un tocco di avocado e altri ingredienti.`,
        `🌿 Un pizzico di alga nori per avvolgerlo perfettamente!`,
        `🍱 Sto impiattando con cura...`,
        `🎌 Voilà! Sushi servito per *${text || "te"}*!`
    ];

    // Sequenza dei messaggi con ritardo
    for (let msg of messages) {
        await conn.reply(message.chat, msg, message);
        await delay(2000); // Ritardo di 2 secondi tra i messaggi
    }

    // Calcolo del tempo di preparazione
    let start = performance.now();
    let end = performance.now();
    let time = (end - start).toFixed(3); // Limitato a 3 cifre decimali

    let finalMessage = `🍣 Sushi preparato in *${time}ms*! Buon appetito, *${text || "amico"}*!`;
    await conn.reply(message.chat, finalMessage, message);
};

// Configurazione del comando
handler.command = ['sushi'];
handler.tags = ['fun'];
handler.help = ['.sushi <nome>'];

export default handler;
