let handler = async (m, { conn, command, text }) => {
    let percentage = Math.floor(Math.random() * 101);

    let finalPhrase = percentage >= 50 
        ? "😡 *Wow, sembra che tra voi due ci sia davvero tensione!*" 
        : "😌 *Forse non è così grave come pensi.*";

    let hate = `
━━━━━━━━━━━━━━━━━━━━━━━
🔥 *𝐂𝐀𝐋𝐂𝐎𝐋𝐀𝐓𝐎𝐑𝐄 𝐃𝐈 𝐎𝐃𝐈𝐎* 🔥
━━━━━━━━━━━━━━━━━━━━━━━
👿 *L'odio tra te e* ${text || 'qualcuno'}:  
💢 *${percentage}%* di intensità! 💢
━━━━━━━━━━━━━━━━━━━━━━━
${finalPhrase}
`.trim();

    const buttons = [
        {
            buttonId: ".odio",
            buttonText: { displayText: "🔁 Riprova" },
            type: 1
        }
    ];

    const buttonMessage = {
        text: hate,
        footer: "Calcola ancora se vuoi!",
        buttons,
        headerType: 1,
        mentions: conn.parseMention(hate)
    };

    // Finto contatto per la citazione (quote)
    let fakeContact = {
        key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: m.chat,
            id: "SVO"
        },
        message: {
            contactMessage: {
                displayName: "𝟐𝟐𝟐 𝐁𝚯𝐓",
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Svo²²²;;;\nFN:Svo²²²\nitem1.TEL;waid=${m.sender.split("@")[0]}:${m.sender.split("@")[0]}\nitem1.X-ABLabel:Cell\nEND:VCARD`
            }
        }
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: fakeContact });
};

handler.command = /^(odio)$/i;
export default handler;