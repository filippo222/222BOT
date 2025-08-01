
const handler = async (m, { conn }) => {
  // Ottieni l'utente target: se rispondi a un messaggio prende lui, altrimenti chi è menzionato, altrimenti l'autore del comando
  const who = m.quoted?.sender || m.mentionedJid?.[0] || m.sender;

  const modelli = [
    // iPhone
    "iPhone 15 Pro Max", "iPhone 15", "iPhone 14 Pro", "iPhone 13 mini", "iPhone SE (2022)",
    // Samsung
    "Samsung Galaxy S24 Ultra", "Samsung Galaxy S23", "Samsung Z Fold 5", "Samsung A54", "Samsung M33",
    // Xiaomi
    "Xiaomi 14 Ultra", "Xiaomi 13T Pro", "Redmi Note 13 Pro", "Poco F5", "Poco X6 Pro",
    // Huawei
    "Huawei P60 Pro", "Huawei Mate 50", "Huawei Nova 11",
    // Oppo
    "Oppo Find X6", "Oppo Reno 11", "Oppo A78",
    // Realme
    "Realme GT Neo 5", "Realme 11 Pro+", "Realme C55",
    // Google
    "Google Pixel 8 Pro", "Google Pixel 7a", "Google Pixel 6",
    // OnePlus
    "OnePlus 12", "OnePlus 11R", "OnePlus Nord 3",
    // Sony, Nokia, Asus
    "Sony Xperia 1 V", "Nokia 3310 (Reboot)", "Nokia Banana Phone", "Asus ROG Phone 8", 
    // Altri
    "Nothing Phone 2", "Motorola Edge 40", "Infinix Zero 30", "Tecno Phantom V Flip"
  ];

  const modello = modelli[Math.floor(Math.random() * modelli.length)];

  const testo = `🔍 *𝐜𝐚𝐫𝐢𝐜𝐚𝐦𝐞𝐧𝐭𝐨 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...*\n📡 𝐯𝐞𝐫𝐢𝐟𝐢𝐜𝐡𝐢𝐚𝐦𝐨 𝐜𝐡𝐞 𝐧𝐨𝐧 𝐬𝐞𝐢 𝐝𝐢 𝐧𝐚𝐩𝐨𝐥𝐢\n✅ Modello rilevato: *${modello}*\n\n@${who.split("@")[0]} 𝐡𝐚 𝐮𝐧 𝐭𝐞𝐥𝐞𝐟𝐨𝐧𝐨 𝐯𝐞𝐫𝐚𝐦𝐞𝐧𝐭𝐞 𝐛𝐞𝐥𝐥𝐨, 𝐅𝐢𝐥𝐢𝐩𝐩𝐨 𝐭𝐞 𝐥𝐨 𝐫𝐮𝐛𝐞𝐫𝐚̀!`;

  conn.reply(m.chat, testo, m, { mentions: [who] });
};

handler.command = /^modello|telefono|device|scanner$/i;

export default handler;