import fs from 'fs'
import syntaxError from 'syntax-error'
import path from 'path'

const _fs = fs.promises

let handler = async (m, { text, usedPrefix, command, __dirname }) => {
    if (!text) throw `
> 𝐔𝐭𝐢𝐥𝐢𝐳𝐳𝐨 : ${usedPrefix + command} <𝐧𝐨𝐦𝐞 𝐟𝐢𝐥𝐞>

📌 Ejemplo:
        ${usedPrefix}getfile main.js
        ${usedPrefix}getplugin owner
`.trim()
    if (/p(lugin)?/i.test(command)) {
        const filename = text.replace(/plugin(s)\//i, '') + (/\.js$/i.test(text) ? '' : '.js')
        const pathFile = path.join(__dirname, filename)
        const file = await _fs.readFile(pathFile, 'utf8')
        m.reply(file)
        const error = syntaxError(file, filename, {
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true
        })
        if (error) {
            await m.reply(`
⛔️ Errore in *${filename}*:

${error}

`.trim())
        }

    } else {
        const isJavascript = /\.js/.test(text)
        if (isJavascript) {
            const file = await _fs.readFile(text, 'utf8')
            m.reply(file)
            const error = syntaxError(file, text, {
                sourceType: 'module',
                allowReturnOutsideFunction: true,
                allowAwaitOutsideFunction: true
            })
            if (error) {
                await m.reply(`
⛔️ Errore in *${text}*:

${error}

`.trim())
            }
        } else {
            const file = await _fs.readFile(text, 'base64')
            await m.reply(Buffer.from(file, 'base64'))
        }
    }
}
handler.help = ['plugin', 'file'].map(v => `get${v} <name file>`)
handler.tags = ['owner']
handler.command = /^fileplugin$/i

handler.owner = true

export default handler