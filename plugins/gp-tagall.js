import fetch from 'node-fetch';

let handler = async (m, { isOwner, isAdmin, conn, text, participants, args, groupMetadata, command }) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    let pesan = args.join` ` || ' 🚨 *𝐀𝐋𝐋𝐄𝐑𝐓𝐀!* 🚨';
    let oi = `📢  ${pesan}`;

    let prova = {
        key: {
            participants: "0@s.whatsapp.net",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: '⚡ 𝐍𝐎𝐍 𝐒𝐈 𝐃𝐎𝐑𝐌𝐄!!! ⚡',
                jpegThumbnail: await (await fetch('https://telegra.ph/file/92576d96e97bb7e3939e2.png')).buffer(),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };

const flags = {
    '39': '🇮🇹', // Italia
    '34': '🇪🇸', // Spagna
    '55': '🇧🇷', // Brasile
    '1': '🇺🇸', // Stati Uniti
    '44': '🇬🇧', // Regno Unito
    '91': '🇮🇳', // India
    '49': '🇩🇪', // Germania
    '33': '🇫🇷', // Francia
    '351': '🇵🇹', // Portogallo
    '7': '🇷🇺', // Russia
    '81': '🇯🇵', // Giappone
    '86': '🇨🇳', // Cina
    '82': '🇰🇷', // Corea del Sud
    '61': '🇦🇺', // Australia
    '52': '🇲🇽', // Messico
    '27': '🇿🇦', // Sudafrica
    '31': '🇳🇱', // Paesi Bassi
    '41': '🇨🇭', // Svizzera
    '43': '🇦🇹', // Austria
    '32': '🇧🇪', // Belgio
    '45': '🇩🇰', // Danimarca
    '46': '🇸🇪', // Svezia
    '47': '🇳🇴', // Norvegia
    '30': '🇬🇷', // Grecia
    '90': '🇹🇷', // Turchia
    '353': '🇮🇪', // Irlanda
    '358': '🇫🇮', // Finlandia
    '354': '🇮🇸', // Islanda
    '372': '🇪🇪', // Estonia
    '371': '🇱🇻', // Lettonia
    '370': '🇱🇹', // Lituania
    '420': '🇨🇿', // Repubblica Ceca
    '421': '🇸🇰', // Slovacchia
    '36': '🇭🇺', // Ungheria
    '40': '🇷🇴', // Romania
    '386': '🇸🇮', // Slovenia
    '385': '🇭🇷', // Croazia
    '381': '🇷🇸', // Serbia
    '382': '🇲🇪', // Montenegro
    '389': '🇲🇰', // Macedonia del Nord
    '355': '🇦🇱', // Albania
    '373': '🇲🇩', // Moldova
    '375': '🇧🇾', // Bielorussia
    '380': '🇺🇦', // Ucraina
    '20': '🇪🇬', // Egitto
    '212': '🇲🇦', // Marocco
    '213': '🇩🇿', // Algeria
    '216': '🇹🇳', // Tunisia
    '971': '🇦🇪', // Emirati Arabi Uniti
    '966': '🇸🇦', // Arabia Saudita
    '972': '🇮🇱', // Israele
    '962': '🇯🇴', // Giordania
    '961': '🇱🇧', // Libano
    '964': '🇮🇶', // Iraq
    '98': '🇮🇷', // Iran
    '92': '🇵🇰', // Pakistan
    '93': '🇦🇫', // Afghanistan
    '94': '🇱🇰', // Sri Lanka
    '84': '🇻🇳', // Vietnam
    '62': '🇮🇩', // Indonesia
    '60': '🇲🇾', // Malaysia
    '66': '🇹🇭', // Thailandia
    '65': '🇸🇬', // Singapore
    '63': '🇵🇭', // Filippine
    '880': '🇧🇩', // Bangladesh
    '977': '🇳🇵', // Nepal
    '975': '🇧🇹', // Bhutan
    '95': '🇲🇲', // Myanmar
    '855': '🇰🇭', // Cambogia
    '856': '🇱🇦', // Laos
    '507': '🇵🇦', // Panama
    '506': '🇨🇷', // Costa Rica
    '502': '🇬🇹', // Guatemala
    '505': '🇳🇮', // Nicaragua
    '504': '🇭🇳', // Honduras
    '503': '🇸🇻', // El Salvador
    '591': '🇧🇴', // Bolivia
    '595': '🇵🇾', // Paraguay
    '598': '🇺🇾', // Uruguay
    '56': '🇨🇱', // Cile
    '57': '🇨🇴', // Colombia
    '58': '🇻🇪', // Venezuela
    '51': '🇵🇪', // Perù
    '593': '🇪🇨', // Ecuador
    '234': '🇳🇬', // Nigeria
    '254': '🇰🇪', // Kenya
    '256': '🇺🇬', // Uganda
    '251': '🇪🇹', // Etiopia
    '250': '🇷🇼', // Ruanda
    '263': '🇿🇼', // Zimbabwe
    '260': '🇿🇲', // Zambia
    '265': '🇲🇼', // Malawi
    '267': '🇧🇼', // Botswana
    '261': '🇲🇬', // Madagascar
    '223': '🇲🇱', // Mali
    '221': '🇸🇳', // Senegal
    '233': '🇬🇭', // Ghana
    '225': '🇨🇮', // Costa d'Avorio
    '229': '🇧🇯', // Benin
    '227': '🇳🇪', // Niger
    '228': '🇹🇬', // Togo
    '231': '🇱🇷', // Liberia
    '241': '🇬🇦', // Gabon
    '240': '🇬🇶', // Guinea Equatoriale
    '242': '🇨🇬', // Repubblica del Congo
    '243': '🇨🇩', // Repubblica Democratica del Congo
    '238': '🇨🇻', // Capo Verde
    '239': '🇸🇹', // São Tomé e Príncipe
    '258': '🇲🇿', // Mozambico
    '262': '🇾🇹', // Mayotte
    '269': '🇰🇲' // Comore
};

    function getFlag(number) {
        let found = Object.keys(flags).find(prefix => number.startsWith(prefix));
        return found ? flags[found] : '🏳️';
    }

    let teks = `
╔══════🌙 *𝐓𝐀𝐆 𝐀𝐋𝐋* 🌙══════╗
║ 🏠 *𝐆𝐫𝐮𝐩𝐩𝐨:*  ${groupMetadata.subject || 'Non sei in un gruppo'}
║ 👥 *𝐌𝐞𝐦𝐛𝐫𝐢:*  ${participants.length}
║ 💬 *𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨:*  ${oi}
╚════════════════════════╝

*𝐌𝐄𝐍𝐓𝐈𝐎𝐍𝐒:*\n
`.trim();

    for (let mem of participants) {
        let num = mem.id.split('@')[0];
        teks += `➤ ${getFlag(num)} @${num}\n`;
    }

    teks += `\n🚀 *𝐁𝐘 𝐒𝐯𝐨²²² 𝐁𝚯𝐓* 🚀`;

    conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted: prova });

};

handler.help = ['tagall'];
handler.tags = ['group'];
handler.command = /^(tagall|marcar)$/i;
handler.group = true;

export default handler;
