

let handler = async (m, { conn, command, text }) => {
    // Calcolo della percentuale di negro
    let percentage = Math.floor(Math.random() * 101);

    // Frase finale basata sulla percentuale
    let finalPhrase = percentage >= 50 
        ? " 👨🏿*Ci avrei scommesso che sei uno sporco negro*"
        : "😅 *Sei una via di mezzo tra negro e bianco! sei marrone!*";

    // Messaggio completo
    let message = `
━━━━━━━━━━━━━━━━━━━━━━━
🧑🏿‍🦲 *CALCOLATORE DEI NEGRI* 👨🏿‍🦰
━━━━━━━━━━━━━━━━━━━━━━━
👨🏿 *${text} è negro al:*  
⚡ *${percentage}%* di livello! ⚡
━━━━━━━━━━━━━━━━━━━━━━━
${finalPhrase}
`.trim();

    m.reply(message, null, { mentions: conn.parseMention(message) });
};

handler.command = /^(negro)$/i;

export default handler;
