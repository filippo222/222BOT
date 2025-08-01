













let handler = async (m, { conn, command, text }) => {
    // Calcolo della percentuale di "transgender"
    let percentage = Math.floor(Math.random() * 101);

    // Frase finale basata sulla percentuale
    let finalPhrase = percentage >= 50 
        ? " *🐶 ma quanto sei un cane😨!*"
        : "*🐶 ma quanto sei un cane😨!*";

    // Messaggio completo
    let message = `
━━━━━━━━━━━━━━━━━━━━━━━
*🐶 CALCOLATORE DI CANEZZA 🐶*
━━━━━━━━━━━━━━━━━━━━━━━
*👤Persona analizzata:* ${text}          
*🐶 Percentuale di canezza: ${percentage}%* 
━━━━━━━━━━━━━━━━━━━━━━━
${finalPhrase}
`.trim();

    m.reply(message, null, { mentions: conn.parseMention(message) });
};

handler.command = /^(cane)$/i;

export default handler;
