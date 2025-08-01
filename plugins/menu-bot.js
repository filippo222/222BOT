import fs from 'fs';
import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
    // Get user info
    const senderName = await conn.getName(m.sender);
    const botName = global.db.data?.nomedelbot || "𝟐𝟐𝟐 𝐁𝚯𝐓 "
    const vs = "1.0.0";

    // Mostra il menu principale se non viene specificato un comando
    if (!command || command.toLowerCase() === 'menu') {
        await showMainMenu(m, conn, usedPrefix, senderName, botName, vs);
        return;
    }

    // Gestione dei comandi specifici
    switch(command.toLowerCase()) {
        case 'menugruppo':
        case 'gruppo':
            await showGroupMenu(m, conn, usedPrefix);
            break;
        case 'funzioni':
            await showFunctionsMenu(m, conn, usedPrefix);
            break;
        case 'menuadm':
        case 'admin':
            await showAdminMenu(m, conn, usedPrefix);
            break;
        case 'owner':
        case 'menuowner':
        case 'pannello':
            await showOwnerMenu(m, conn, usedPrefix);
            break;
        case 'menuroulette':
            await showRouletteMenu(m, conn, usedPrefix);
            break;
        default:
            await showMainMenu(m, conn, usedPrefix, senderName, botName, vs);
    }
};

// Menu Principale con Pulsanti
async function showMainMenu(m, conn, usedPrefix, senderName, botName, vs) {
    const buttons = [
        { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: '👥 GRUPPO' }, type: 1 },
        { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: '⚙️ FUNZIONI' }, type: 1 },
        { buttonId: `${usedPrefix}menuadm`, buttonText: { displayText: '🛠️ ADMIN' }, type: 1 },
        { buttonId: `${usedPrefix}owner`, buttonText: { displayText: '👑 OWNER' }, type: 1 },
        { buttonId: `${usedPrefix}menuroulette`, buttonText: { displayText: '🎮 ROULETTE' }, type: 1 }
    ];

    const buttonMessage = {
        text: `╭━━〔𝐌𝐞𝐧𝐮 𝐁𝐨𝐭〕━━╮
┃
┃ 👤𝐔𝐭𝐞𝐧𝐭𝐞: ${senderName}
┃ 🧩𝐕𝐞𝐫𝐬𝐢𝐨𝐧𝐞: ${vs}
┃
╰━━━━━━━━━━━━━━━━━━╯`,
        footer: `${botName}`,
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
}

// Menu Gruppo con Pulsanti
async function showGroupMenu(m, conn, usedPrefix) {
    const thumbnail = await (await fetch("https://qu.ax/cSqEs.jpg")).buffer();
    
    const menuText = `
╭═══〔 ✨MENU GRUPPO✨ 〕═══╮

𓆩✧𓆪 abbraccia @  
𓆩✧𓆪 lecco/a @  
𓆩✧𓆪 mordi @  
𓆩✧𓆪 alcolizzato @  
𓆩✧𓆪 riscrivi (messaggio)  
𓆩✧𓆪 meteo (città)  
𓆩✧𓆪 hd (foto)  
𓆩✧𓆪 leggi (foto)  
𓆩✧𓆪 setig  
𓆩✧𓆪 eliminaig  
𓆩✧𓆪 creacoppia  
𓆩✧𓆪 tris  
𓆩✧𓆪 sorte  
𓆩✧𓆪 verita  
𓆩✧𓆪 obbligo  
𓆩✧𓆪 calc(1+1)  
𓆩✧𓆪 id (gruppo)  
𓆩✧𓆪 autoadmin  
𓆩✧𓆪 invita  
𓆩✧𓆪 paghetta  
𓆩✧𓆪 deposita  
𓆩✧𓆪 furto  
𓆩✧𓆪 famiglia  
𓆩✧𓆪 bottiglia  
𓆩✧𓆪 sticker /s  
𓆩✧𓆪 togif | tovideo  
𓆩✧𓆪 emojimix  
𓆩✧𓆪 portafoglio  
𓆩✧𓆪 ai  
𓆩✧𓆪 wikipedia  
𓆩✧𓆪 compra
𓆩✧𓆪 napolicane
╰═══〔𓆩✧𓆪𝐌𝐞𝐧𝐮 𝐁𝐨𝐭𓆩✧𓆪〕═══╯
`.trim();

    const buttons = [
        { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '🔙 MENU PRINCIPALE' }, type: 1 },
        { buttonId: `${usedPrefix}admin`, buttonText: { displayText: '🛠️ ADMIN' }, type: 1 },
        { buttonId: `${usedPrefix}menuroulette`, buttonText: { displayText: '🎮 ROULETTE' }, type: 1 },
        { buttonId: `${usedPrefix}owner`, buttonText: { displayText: '👑 OWNER' }, type: 1 },
        { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: '⚙️ FUNZIONI' }, type: 1 },
    ];

    const buttonMessage = {
        text: menuText,
        footer: 'Seleziona un\'opzione',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
}

// Menu Funzioni con Pulsanti
async function showFunctionsMenu(m, conn, usedPrefix) {
    const chat = global.db.data.chats[m.chat] || {};
    const {
        antiToxic,
        antilinkhard,
        antiPrivate,
        antitraba,
        antiArab,
        antiviewonce,
        isBanned,
        welcome,
        detect,
        sWelcome,
        sBye,
        sPromote,
        sDemote,
        antiLink,
        antilinkbase,
        antitiktok,
        sologruppo,
        soloprivato,
        antiCall,
        modohorny,
        gpt,
        antiinsta,
        antielimina,
        antitelegram,
        antiSpam,
        antiPorno,
        jadibot,
        autosticker,
        modoadmin,
        audios,
        antirub,
        antinuke,
        antiyt
    } = chat;

    const stato = (val) => val ? '🟩' : '🟥';
    const thumbnail = await (await fetch("https://qu.ax/cSqEs.jpg")).buffer();

    const testo = `
╔════════════════╗
 ${stato(detect)} » ${usedPrefix}detect
 ${stato(gpt)} » ${usedPrefix}gpt
 ${stato(jadibot)} » ${usedPrefix}jadibot
 ${stato(welcome)} » ${usedPrefix}benvenuto
 ${stato(sologruppo)} » ${usedPrefix}sologruppo
 ${stato(soloprivato)} » ${usedPrefix}soloprivato
 ${stato(modoadmin)} »${usedPrefix}modoadmin
 ${stato(isBanned)} » ${usedPrefix}bangp
 ${stato(antiPorno)} » ${usedPrefix}antiporno
 ${stato(antiCall)} » ${usedPrefix}anticall
 ${stato(antitraba)} » ${usedPrefix}antitraba
 ${stato(antiArab)} » ${usedPrefix}antipaki
 ${stato(antiLink)} » ${usedPrefix}antilink
 ${stato(antiinsta)} » ${usedPrefix}antiinsta
 ${stato(antitiktok)} » ${usedPrefix}antitiktok
 ${stato(antielimina)} » ${usedPrefix}antielimina
 ${stato(antiyt)} » ${usedPrefix}antiyt
╚═════════════════╝
ⓘ Uso del comando:
» ${usedPrefix}attiva nome
» ${usedPrefix}disabilita nome
`.trim();

    const buttons = [
        { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '🔙 MENU PRINCIPALE' }, type: 1 },
        { buttonId: `${usedPrefix}admin`, buttonText: { displayText: '🛠️ ADMIN' }, type: 1 },
        { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: '👥 GRUPPO' }, type: 1 }
    ];

    const buttonMessage = {
        text: testo,
        footer: 'Gestisci le funzioni del bot',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
}

// Menu Admin con Pulsanti
async function showAdminMenu(m, conn, usedPrefix) {
    const fake = {
        key: {
            participants: "0@s.whatsapp.net",
            fromMe: false,
            id: 'Halo'
        },
        message: {
            locationMessage: {
                name: "『 MENU GRUPPO 』",
                jpegThumbnail: fs.readFileSync('./icone/admin.png'),
                vcard: `BEGIN:VCARD
VERSION:3.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };

    const menu = `
╭━━━「 GRUPPO 」━━━╮
┃ 🔧 *Comandi Admin* 🔧
┃
┃ ✧ ${usedPrefix}promuovi / p
┃ ✧ ${usedPrefix}retrocedi / r
┃ ✧ ${usedPrefix}warn / unwarn
┃ ✧ ${usedPrefix}muta / smuta
┃ ✧ ${usedPrefix}mutelist
┃ ✧ ${usedPrefix}hidetag
┃ ✧ ${usedPrefix}tagall
┃ ✧ ${usedPrefix}aperto / chiuso
┃ ✧ ${usedPrefix}setwelcome
┃ ✧ ${usedPrefix}setbye
┃ ✧ ${usedPrefix}inattivi
┃ ✧ ${usedPrefix}listanum + prefisso
┃ ✧ ${usedPrefix}pulizia + prefisso
┃ ✧ ${usedPrefix}rimozione inattivi
┃ ✧ ${usedPrefix}sim
┃ ✧ ${usedPrefix}admins
┃ ✧ ${usedPrefix}freeze @
┃ ✧ ${usedPrefix}ispeziona <link>
┃ ✧ ${usedPrefix}top (10, 50, 100)
┃ ✧ ${usedPrefix}topsexy
┃ ✧ ${usedPrefix}pic @
┃ ✧ ${usedPrefix}picgruppo
┃ ✧ ${usedPrefix}nome <testo>
┃ ✧ ${usedPrefix}bio <testo>
┃ ✧ ${usedPrefix}linkqr
┃
╰━━━━━━━━━━━━━━━╯
`.trim();

    const buttons = [
        { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '🔙 MENU PRINCIPALE' }, type: 1 },
        { buttonId: `${usedPrefix}tagall`, buttonText: { displayText: '🍃TAG ALL' }, type: 1 },
        { buttonId: `${usedPrefix}top 10`, buttonText: { displayText: '🔝TOP 10' }, type: 1 }
    ];

    const buttonMessage = {
        text: menu,
        footer: 'Comandi disponibili per gli admin',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
}

// Menu Owner con Pulsanti
async function showOwnerMenu(m, conn, usedPrefix) {
    const botName = global.db.data.nomedelbot || " ꙰222 ꙰ 𝔹𝕆𝕋 ꙰ ";
    const menuText = `
╭───〔 ⚡ *PANNELLO OWNER* ⚡ 〕───╮

📌 *Comandi disponibili:*

🛠️ *Gestione Nome & Gruppi*
  ✦ .impostanome
  ✦ .resettanome
  ✦ .setgruppi
  ✦ .aggiungigruppi @
  ✦ .resetgruppi @
  ✦ .setpp (immagine)

🔒 *Gestione Utenti*
  ✦ .gestisci @
  ✦ .banuser @
  ✦ .unbanuser @
  ✦ .blockuser @
  ✦ .unblockuser @

⚙️ *Strumenti di Controllo*
  ✦ .pulizia (+)
  ✦ .out
  ✦ .prefisso (?)
  ✦ .resetprefisso
  ✦ .godmode
  ✦ .azzerare @
  ✦ .aggiungi 99 @
  ✦ .rimuovi 50 @
  ✦ .nuke
  ✦ .nukeall

👑 *Gestione Owner*
  ✦ .addowner @
  ✦ .delowner @
  ✦ .downall
  ✦ .upall

🚧 *Blacklist & Protezioni*
  ✦ .blocklist
  ✦ .banlist
  ✦ .banghost
  ✦ .lock
  ✦ .safe

📂 *File & Plugin*
  ✦ .getplugin
  ✦ .getfile
  ✦ .saveplugin
  ✦ .deleteplugin

🔰 *Altri Comandi*
  ✦ .sponsor
  ✦ .bigtag
  ✦ .enc <testo>
  ✦ .menucrash

╰───〔 ⚡ ${botName} ⚡ 〕───╯
`.trim();

    const buttons = [
        { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '🔙 MENU PRINCIPALE' }, type: 1 },
        { buttonId: `${usedPrefix}`, buttonText: { displayText: '' }, type: 1 },
        { buttonId: `${usedPrefix}`, buttonText: { displayText: '' }, type: 1 }
    ];

    const buttonMessage = {
        text: menuText,
        footer: 'Comandi esclusivi per owner',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
}

// Menu Roulette con Pulsanti
async function showRouletteMenu(m, conn, usedPrefix) {
    const text = `
═════ ೋೋ═════
🎰 MENU ROULETTE 🎰
═════ ೋೋ═════

📌 COMANDI:

1️⃣ LOBBY
  Usa: assicurati di creare una lobby con 
  nome e quota: 
  *.roulette lobby <nome> <quota>*
  💰 Quota massima: 10000€

2️⃣ JOIN
  Partecipa a una lobby esistente:
  *.roulette join <nome_lobby>*
  ⚠️ Partita non iniziata e non esistente.

3️⃣ START
  Avvia la partita entrati a minimo 2 giocatori:
  *.roulette start <nome_lobby>*
  🔒 Solo il creatore.

4️⃣ SHOT
  Sparare a un giocatore nella partita:
  *.roulette shot @utente*
  🎯 40% di probabilità di colpire.

5️⃣ VITE
  Visualizza le vite rimaste dei giocatori:
  *.roulette vite <nome_lobby>*

6️⃣ STOP
  Ferma e cancella la lobby:
  *.roulette stop <nome_lobby>*
  🔒 Solo il creatore.

═════ ೋೋ═════
💡 Usa i comandi con attenzione e buona fortuna!
═════ ೋೋ═════
`;

    const buttons = [
        { buttonId: `${usedPrefix}menu`, buttonText: { displayText: 'MENU PRINCIPALE' }, type: 1 },
        { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: '⚙️ FUNZIONI' }, type: 1 },
        { buttonId: `${usedPrefix}admin`, buttonText: { displayText: '🛠️ ADMIN' }, type: 1 }
    ];

    const buttonMessage = {
        text: text,
        footer: 'Gioca responsabilmente!',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
}

handler.help = ["menu", "menugruppo", "funzioni", "menuadm", "owner", "menuroulette"];
handler.tags = ['menu'];
handler.command = /^(menu|menugruppo|gruppo|funzioni|menuadm|admin|owner|menuowner|pannello|menuroulette)$/i;

export default handler;