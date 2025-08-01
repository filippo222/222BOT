const handler = async (m, { conn, usedPrefix, command }) => {
    const user = global.db.data.users[m.sender] || {}
    user.money = user.money || 10000
    user.grattaevinci = user.grattaevinci || 0

    const costoBiglietto = 50
    const maxBiglietti = Math.min(200, Math.floor(user.money / costoBiglietto))

    if (maxBiglietti < 10) {
        return conn.reply(m.chat, 
            `❌ Non hai abbastanza soldi per giocare!\nTi servono almeno ${costoBiglietto * 10} soldi (per 10 biglietti)\nAttualmente hai: ${user.money} soldi`, 
            m)
    }

    const buttons = [
        { buttonId: `${usedPrefix}${command} play 10`, buttonText: { displayText: `10 biglietti (${costoBiglietto * 10}💰)` }, type: 1 },
        { buttonId: `${usedPrefix}${command} play 20`, buttonText: { displayText: `20 biglietti (${costoBiglietto * 20}💰)` }, type: 1 },
        { buttonId: `${usedPrefix}${command} play 50`, buttonText: { displayText: `50 biglietti (${costoBiglietto * 50}💰)` }, type: 1 },
        { buttonId: `${usedPrefix}${command} play 100`, buttonText: { displayText: `100 biglietti (${costoBiglietto * 100}💰)` }, type: 1 },
        { buttonId: `${usedPrefix}${command} play 200`, buttonText: { displayText: `200 biglietti (${costoBiglietto * 200}💰)` }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
        text: `🎰 *GRATTA E VINCI* 🎰\n\n` +
              `💰 Costo per biglietto: ${costoBiglietto} soldi\n` +
              `💵 Tuo saldo: ${user.money.toLocaleString()} soldi\n\n` +
              `🔢 Quanti biglietti vuoi acquistare?`,
        footer: `Massimo acquistabile: ${maxBiglietti} biglietti`,
        buttons: buttons.slice(0, Math.ceil(maxBiglietti/50)), // Mostra solo i pulsanti disponibili
        headerType: 1
    })
}

handler.help = ['grattaevinci']
handler.tags = ['economy']
handler.command = ['grattaevinci', 'lotto']

handler.play = async (m, { conn, usedPrefix, command, args }) => {
    const user = global.db.data.users[m.sender] || {}
    user.money = user.money || 10000
    user.grattaevinci = user.grattaevinci || 0

    const numBiglietti = parseInt(args[0])
    const costoBiglietto = 50
    const costoTotale = numBiglietti * costoBiglietto

    if (!numBiglietti || isNaN(numBiglietti)) return
    if (numBiglietti < 10 || numBiglietti > 200) return conn.reply(m.chat, 'Devi scegliere tra 10 e 200 biglietti!', m)
    if (user.money < costoTotale) return conn.reply(m.chat, `Non hai abbastanza soldi! Ti servono ${costoTotale} soldi`, m)

    user.money -= costoTotale

    // Simulazione gratta e vinci
    const premi = [
        { prob: 0.4, min: 10, max: 100 },       // Piccoli premi
        { prob: 0.1, min: 100, max: 1000 },     // Premi medi
        { prob: 0.01, min: 1000, max: 10000 }   // Grandi premi
    ]

    let vincite = 0
    let risultati = []

    for (let i = 0; i < numBiglietti; i++) {
        const random = Math.random()
        let vinto = 0

        for (const premio of premi) {
            if (random < premio.prob) {
                vinto = Math.floor(Math.random() * (premio.max - premio.min + 1)) + premio.min
                break
            }
        }

        if (vinto > 0) {
            vincite += vinto
            risultati.push(`🎟 Biglietto ${i+1}: ${vinto.toLocaleString()} soldi`)
        }
    }

    user.money += vincite
    user.grattaevinci += risultati.length

    let msg = `🎉 *RISULTATI GRATTA E VINCI* 🎉\n\n`
    msg += `📦 Biglietti acquistati: ${numBiglietti}\n`
    msg += `💸 Spesa totale: ${costoTotale.toLocaleString()} soldi\n`
    msg += `💰 Totale vinto: ${vincite.toLocaleString()} soldi\n`
    msg += `💵 Saldo attuale: ${user.money.toLocaleString()} soldi\n\n`
    
    if (risultati.length > 0) {
        msg += `🏆 BIGLIETTI VINCENTI:\n`
        msg += risultati.slice(0, 10).join('\n')
        if (risultati.length > 10) msg += `\n\n...e altri ${risultati.length - 10} premi!`
    } else {
        msg += `😢 Nessun premio vinto questa volta...`
    }

    await conn.reply(m.chat, msg, m)
}

export default handler