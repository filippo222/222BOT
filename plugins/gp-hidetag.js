import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import * as fs from 'fs';

let handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
    try {
        let users = participants.map(u => conn.decodeJid(u.id));
        let q = m.quoted ? m.quoted : m || m.text || m.sender;
        let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender;
        let tagBy = `𝐓𝚲𝐆 𝐁𝕐 @${m.sender.split('@')[0]}\n`; // Aggiunto il tag
        let msg = conn.cMod(
            m.chat,
            generateWAMessageFromContent(
                m.chat,
                { [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted ? c.message[q.mtype] : { text: '' || c } },
                {}
            ),
            `${tagBy}\n${text || q.text}`, // Include "tag by @user"
            conn.user.jid,
            { mentions: users }
        );
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch {
        /** 
         [ By @NeKosmic || https://github.com/NeKosmic/ ]
         **/
        let users = participants.map(u => conn.decodeJid(u.id));
        let quoted = m.quoted ? m.quoted : m;
        let mime = (quoted.msg || quoted).mimetype || '';
        let isMedia = /image|video|sticker|audio/.test(mime);
        let more = String.fromCharCode(8206);
        let masss = more.repeat(850);
        let tagBy = `Tag by @${m.sender.split('@')[0]}`; // Aggiunto il tag
        let htextos = `${tagBy}\n${text ? text : ".hidetag"}`;

        if ((isMedia && quoted.mtype === 'imageMessage') && htextos) {
            var mediax = await quoted.download?.();
            conn.sendMessage(m.chat, { image: mediax, mentions: users, caption: htextos }, { quoted: m });
        } else if ((isMedia && quoted.mtype === 'videoMessage') && htextos) {
            var mediax = await quoted.download?.();
            conn.sendMessage(m.chat, { video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos }, { quoted: m });
        } else if ((isMedia && quoted.mtype === 'audioMessage') && htextos) {
            var mediax = await quoted.download?.();
            conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4', fileName: `Hidetag.mp3` }, { quoted: m });
        } else if ((isMedia && quoted.mtype === 'stickerMessage') && htextos) {
            var mediax = await quoted.download?.();
            conn.sendMessage(m.chat, { sticker: mediax, mentions: users }, { quoted: m });
        } else {
            await conn.relayMessage(
                m.chat,
                {
                    extendedTextMessage: {
                        text: `${masss}\n${htextos}\n`,
                        contextInfo: {
                            mentionedJid: users,
                            externalAdReply: {
                                thumbnail: imagen1,
                                sourceUrl: 'stocazzo'
                            }
                        }
                    }
                },
                {}
            );
        }
    }
};

handler.command = /^(hidetag|tag)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;