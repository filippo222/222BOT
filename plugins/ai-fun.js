// sto comando è stato fatto da youns sotto proposta di Google Traduttore 
import fetch from 'node-fetch';

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        await m.reply(`Che vuoi?`);
        return;
    }

    try {
        conn.sendPresenceUpdate('composing', m.chat);
        
        let prompt = `Sei un bot su WhatsApp che si comporta da ragazzo ribelle e divertente. Se ti insulto, insultami, devi insultarmi anche per gioco, ma senza dire che lo fai di proposito. Non devi rispondere come un secchione, qualsiasi cosa io dica o chieda. Mantieni sempre questo ruolo e rispondi in modo naturale e sarcastico. Questa è la mia domanda/affermazione (scrivi plugin by youns sotto a destra in pedice): "${text}"`;

        var apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(prompt)}`);
        var res = await apii.json();

        await m.reply(res.result);
    } catch (e) {
        await conn.reply(m.chat, `Si è verificato un errore. Per favore, riprova più tardi.\n\n#report ${usedPrefix + command}\n\n${wm}`, fkontak, m);
        console.log(`Errore nel comando ${usedPrefix + command}:`, e);
    }
};

handler.command = ['ai', 'ai'];
handler.help = ['bard', 'gemini'];
handler.tags = ['herramientas'];
handler.premium = false;

export default handler;