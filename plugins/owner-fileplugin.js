import fs from 'fs'
import path from 'path'

const ESTENSIONI = ['.js', '.json', '.txt', '.md'] // Puoi aggiungerne altre se vuoi

let handler = async (m, { text, conn, __dirname }) => {
  if (!text) return m.reply('❗ Inserisci il nome base del file.\nEsempio: .ottienifile owner-nuke')

  try {
    // Prova a trovare il file tra le estensioni supportate
    let fileTrovato = null
    for (let estensione of ESTENSIONI) {
      const filepath = path.join(__dirname, text + estensione)
      if (fs.existsSync(filepath)) {
        fileTrovato = { path: filepath, nome: text + estensione }
        break
      }
    }

    if (!fileTrovato) return m.reply(`❌ Nessun file trovato con base "${text}" nelle estensioni: ${ESTENSIONI.join(', ')}`)

    const buffer = await fs.promises.readFile(fileTrovato.path)
    return await conn.sendMessage(m.chat, {
      document: buffer,
      fileName: fileTrovato.nome,
      mimetype: 'application/octet-stream'
    }, { quoted: m })

  } catch (err) {
    console.error('Errore durante invio file:', err)
    return m.reply('❌ Si è verificato un errore durante il recupero del file.')
  }
}

handler.help = ['ottienifile <nomebase>']
handler.tags = ['owner']
handler.command = /^ottienifile$/i
handler.owner = true

export default handler