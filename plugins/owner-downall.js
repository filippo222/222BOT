
// Solo il bot lo può usare (o gli owner [Youns è il migliore])
let handler = async (m, { conn, groupMetadata, participants, isBotAdmin, isSuperAdmin }) => {
    // Verifica se il bot ha l'admin
    if (!isBotAdmin) {
        await conn.sendMessage(m.chat, { text: "❌ Il bot deve essere amministratore per eseguire questo comando!" });
        return;
    }

    // Identifica il founder (se c'è) e l'elenco degli admin
    const ownerGroup = groupMetadata.owner || null; 
    const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(a => a.id);

    // Rimuove solo gli admin diversi dal bot e dal founder
    const adminsToRemove = admins.filter(admin => admin !== conn.user.jid && admin !== ownerGroup);

    if (adminsToRemove.length === 0) {
        await conn.sendMessage(m.chat, { text: "⚠️ Non ci sono amministratori da rimuovere, oltre al bot e al founder." });
        return;
    }

    // Messaggio iniziale
    await conn.sendMessage(m.chat, { text: "⚠️ Procedo con la dittatura." });

    // Rimozione degli admin
    for (let admin of adminsToRemove) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [admin], 'demote');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa tra le operazioni
        } catch (err) {
            console.error(`Errore nella rimozione di ${admin}:`, err);
        }
    }

    // Messaggio finale
    await conn.sendMessage(m.chat, { text: "Ora ci sono io come vostro dittatore" });
};

// Configurazione del comando
handler.command = /^downall$/i; // Comando associato
handler.group = true; // Solo per i gruppi
handler.rowner = true; // Per owner
export default handler;
