import fs from 'fs';
import path from 'path';
import syntaxError from 'syntax-error';

const ESTENSIONI = ['.js', '.json', '.txt', '.md'];
const _fs = fs.promises;

const handler = async (m, { conn, text, usedPrefix, command, __dirname }) => {
  try {
    if (!text?.trim()) {
      return conn.sendMessage(m.chat, {
        text: `╭━━〔 ❗ 〕━━┈⊷\n┃◈ Inserisci il nome base del file\n┃◈ Esempio: ${usedPrefix}getplugin owner-nuke\n╰━━━━━━━━━━┈·๏`
      }, { quoted: m });
    }

    // Ricerca file con estensioni supportate
    let filePath = null, fileNome = '';
    for (const ext of ESTENSIONI) {
      const potential = path.join(__dirname, text + ext);
      if (fs.existsSync(potential)) {
        filePath = potential;
        fileNome = text + ext;
        break;
      }
    }

    if (!filePath) {
      return conn.sendMessage(m.chat, {
        text: `╭━━〔 ⚠️ 〕━━┈⊷\n┃◈ Nessun file trovato con nome base "${text}"\n┃◈ Estensioni cercate: ${ESTENSIONI.join(', ')}\n╰━━━━━━━━━━┈·๏`
      }, { quoted: m });
    }

    const messaggio = `╭〔📂 𝐅𝐈𝐋𝐄 𝐓𝐑𝐎𝐕𝐀𝐓𝐎〕┈⊷
┃◈╭────────────·๏
┃◈┃• Nome: ${fileNome}
┃◈┃• Percorso: ${filePath.replace(__dirname, '.') || '.'}
┃◈╰────────────·๏
╰━━━━━━━━━━━━━┈·๏`;

    await conn.sendMessage(m.chat, {
      text: messaggio,
      footer: 'Scegli cosa vuoi fare con il file:',
      buttons: [
        { buttonId: `${usedPrefix}fileplugin ${text}`, buttonText: { displayText: '📜 Script' }, type: 1 },
        { buttonId: `${usedPrefix}ottienifile ${text}`, buttonText: { displayText: '📁 File' }, type: 1 }
      ],
      viewOnce: true,
      headerType: 4
    }, { quoted: m });

  } catch (err) {
    console.error('Errore:', err);
    await conn.sendMessage(m.chat, {
      text: `╭━━〔 ❗ 〕━━┈⊷\n┃◈ Errore: ${err.message}\n╰━━━━━━━━━━┈·๏`
    }, { quoted: m });
  }
};

handler.help = ['getplugin <nomefile>', 'getfile <nomefile>'];
handler.tags = ['owner'];
handler.command = /^g(et)?(p(lugin)?|f(ile)?)$/i;
handler.owner = true;

export default handler;