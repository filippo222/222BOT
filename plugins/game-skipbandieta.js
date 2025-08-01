import fs from 'fs';

const handler = async (m, { conn }) => {
    // Controlla se c'è una partita in corso nella chat
    const game = global.bandieraGame?.[m.chat];
    
    if (!game) {
        return m.reply("⚠️ Nessuna partita di bandiera in corso in questa chat!");
    }

    // Termina la partita
    clearTimeout(game.timeout);
    delete global.bandieraGame[m.chat];
    
    // Invia la risposta corretta
    await conn.reply(m.chat, 
        `⛔️ Partita terminata su richiesta.\nLa risposta corretta era: *${game.rispostaOriginale}*`, 
        m
    );
};

handler.help = ['skipbandiera'];
handler.tags = ['bandiera'];
handler.command = /^(skipbandiera|saltabandiera)$/i;
handler.group = true;
handler.game = true;

export default handler;