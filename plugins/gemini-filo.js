import fetch from 'node-fetch';

var handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) {
    throw `⚠️ Devi inserire una richiesta o un comando per usare la funzione Bard.\n\n📌 *Esempi di utilizzo:*\n❏ ${usedPrefix + command} Consigliami una top 10 di film d'azione\n❏ ${usedPrefix + command} Codice in JS per un gioco di carte`;
  }

  try {
    conn.sendPresenceUpdate('composing', m.chat);
    
    // Richiesta all'API con gestione degli errori
    var apiResponse = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(text)}`);
    
    if (!apiResponse.ok) {
      throw new Error(`Errore ${apiResponse.status}: la risposta dell'API non è valida.`);
    }

    var res = await apiResponse.json();
    
    if (!res.result) {
      throw new Error('L\'API non ha restituito un risultato valido.');
    }

    // Invia la risposta all'utente
    await m.reply(res.result);
    
  } catch (e) {
    console.error(`Errore nel comando ${command}:`, e);

    await conn.reply(
      m.chat,
      `Si è verificato un errore durante l'elaborazione della richiesta.\n\nRiprova più tardi.`,
      null, // Puoi aggiungere un oggetto di contatto se necessario
      m
    );
  }
};

handler.command = ['bard', 'gemini'];
handler.help = ['bard', 'gemini'];
handler.tags = ['strumenti'];
handler.premium = false;

export default handler;