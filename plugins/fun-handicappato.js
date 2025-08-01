let handler = async (m, { conn, command, text }) => {
    let genere = command.toLowerCase() === "handicappato" ? "handicappato" : "handicappata";
    let percent = Math.floor(Math.random() * 101);

    let message = `
╔════════════════════════════╗
║      😟 CALCOLATORE DI HANDICAP 😟      ║
╠════════════════════════════╣
║ 🤔 *${text || 'Tu'} è ${genere} al ${percent}%!* ║
╠════════════════════════════╣
║        *Ecco perché fai così* 🤣        ║
╚════════════════════════════╝

> 𝐒𝐯𝐨²²² 𝐁𝚯𝐓
`.trim();

    const buttons = [
        {
            buttonId: ".handicappato",  // bottone sempre con questo id
            buttonText: { displayText: "🔁 Riprova Disabile" },
            type: 1
        }
    ];

    const buttonMessage = {
        text: message,
        footer: "quanto ti da l'INPS?😭",
        buttons,
        headerType: 1,
        mentions: []
    };

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
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Svo²²²;;;\nFN:Svo²²²\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Cell\nEND:VCARD`
            }
        }
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: fakeContact });
};

handler.command = /^(handicappato|handicappata)$/i;
export default handler;