import fetch from "node-fetch";

let handler = async (m, { conn, groupMetadata, participants, isBotAdmin, args }) => {
    try {
        let bot = global.db.data.settings[conn.user.jid] || {};
        if (!bot.restrict || !isBotAdmin) return;

        let originalName = groupMetadata.subject;
        const newGroupName = `${originalName} | Rub By Chill`;

        await conn.groupUpdateSubject(m.chat, newGroupName);
        await conn.groupSettingUpdate(m.chat, "announcement");

        let inviteCode = await conn.groupInviteCode(m.chat);
        let groupLink = `𝐂𝐈 𝐓𝐑𝐀𝐒𝐅𝐄𝐑𝐈𝐀𝐌𝐎 𝐐𝐔𝐈̀ 𝐄𝐍𝐓𝐑𝐀𝐓𝐄 𝐓𝐔𝐓𝐓𝐈:\n${"https://chat.whatsapp.com/GMRoNG42Nj5C14Zm47h06k"}`;

        let users = participants.map((u) => conn.decodeJid(u.id));

        let imageBuffer = await (await fetch("https://telegra.ph/file/92576d96e97bb7e3939e2.png")).buffer();

        let groupTitle = groupMetadata?.subject || "🟣 GRUPPO";
        let messageContent = args.join` `;

        let formattedMessage = `ೋೋ══ • ══ೋೋ
➣ 𝐆𝐫𝐮𝐩𝐩𝐨 » ${groupTitle}  
➣ 𝐌𝐞𝐦𝐛𝐫𝐢 » ${participants.length}
➣ 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 »${messageContent ? `\n${messageContent}` : ""}
 ೋೋ══ • ══ೋೋ
`;

        for (let participant of participants) {
            formattedMessage += `➣ @${participant.id.split('@')[0]}\n`;
        }

        formattedMessage += "ೋೋ══ • ══ೋೋ";

        let quotedMessage = {
            key: { participant: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
            message: {
                locationMessage: {
                    name: "𝐍𝐎𝐍 𝐒𝐈 𝐃𝐎𝐑𝐌𝐄!!!",
                    jpegThumbnail: imageBuffer,
                }
            },
            participant: '0@s.whatsapp.net'
        };

        await conn.sendMessage(m.chat, {
            text: formattedMessage.trim(),
            mentions: participants.map(p => p.id)
        }, {
            quoted: quotedMessage
        });

        const sendHidetagMessage = async (message) => {
            let more = String.fromCharCode(0);
            let hiddenSpace = more.repeat(0);
            await conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: `${hiddenSpace}\n${message}\n`,
                    contextInfo: { mentionedJid: users },
                },
            }, {});
        };

        await sendHidetagMessage(groupLink);

    } catch (e) {
        console.error(e);
        conn.sendMessage(m.chat, { text: "⚠️ Errore durante l'esecuzione del comando!" });
    }
};

handler.command = ['tryrub'];
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;