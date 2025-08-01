import fetch from 'node-fetch';

const bestemmiaGradi = [
  { min: 1, max: 24, nome: "Peccatore Occasionale", emoji: "😐" },
  { min: 25, max: 49, nome: "Empio Recidivo", emoji: "😶‍🌫️" },
  { min: 50, max: 74, nome: "Blasfemo Iniziato", emoji: "🩸" },
  { min: 75, max: 99, nome: "Eretico Consacrato", emoji: "🔥" },
  { min: 100, max: 149, nome: "Scomunicato Ufficiale", emoji: "🕯️" },
  { min: 150, max: 299, nome: "Profanatore Supremo", emoji: "⚰️" },
  { min: 300, max: Infinity, nome: "Avatar della Bestemmia", emoji: "⛧" }
];

const bestemmieRegex = /porco dio|porcodio|dio bastardo|dio cane|porcamadonna|madonnaporca|dio cristo|diocristo|dio maiale|diomaiale|cristo madonna|madonna impanata|dio frocio|dio gay|dio infuocato|dio crocifissato|madonna puttana|madonna vacca|madonna inculata|maremma maiala|jesu porco|diocane|padre pio|madonna troia|zoccola madonna|dio pentito/i;

export async function before(m, { conn }) {
  // Verifica se il bestemmiometro è attivo nel gruppo o globalmente
  const chat = global.db.data.chats[m.chat];
  if (chat && chat.bestemmiometro === false) return; // Se disattivato nel gruppo, esci
  
  const user = global.db.data.users[m.sender];
  user.blasphemy = user.blasphemy || 0;

  if (!bestemmieRegex.test(m.text)) return;

  user.blasphemy += 1;
  const grado = bestemmiaGradi.find(g => user.blasphemy >= g.min && user.blasphemy <= g.max) || { nome: "Eresiarca Anonimo", emoji: "❓" };

  const thumb = await (await fetch("https://telegra.ph/file/ba01cc1e5bd64ca9d65ef.jpg")).buffer();

  const msg = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
    message: {
      locationMessage: {
        name: "𝑩𝑬𝑺𝑻𝑬𝑴𝑴𝑰𝑶𝑴𝑬𝑻𝑹𝑶🛐",
        jpegThumbnail: thumb,
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Bestemmiatore;;;\nFN:Bestemmiatore\nEND:VCARD"
      }
    },
    participant: "0@s.whatsapp.net"
  };

  const testo = `ೋೋ═══•═══ೋೋ
📛 𝑼𝒕𝒆𝒏𝒕𝒆: @${m.sender.split('@')[0]}
📊 𝑪𝒐𝒏𝒕𝒆𝒈𝒈𝒊𝒐: *${user.blasphemy}*

> 🎖️ 𝑮𝒓𝒂𝒅𝒐: *${grado.nome}* ${grado.emoji}
ೋೋ═══•═══ೋೋ`;

  await conn.reply(m.chat, testo, msg, { mentions: [m.sender] });
}