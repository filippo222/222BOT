let handler = async (m, { conn, isAdmin, isBotAdmin, args, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply("❌ Questo comando si usa solo nei gruppi.");
  if (!isBotAdmin) return m.reply("🤖 Devo essere admin per accettare le richieste.");
  if (!isAdmin) return m.reply("🔒 Solo gli admin del gruppo possono usare questo comando.");

  const groupId = m.chat;
  const pending = await conn.groupRequestParticipantsList(groupId);

  if (!pending.length) return m.reply("📭 Non ci sono richieste da accettare.");

  // Funzione per aggiornare le richieste in batch
  async function updateRequests(participants, action) {
    let successCount = 0;
    let errors = [];
    for (const p of participants) {
      try {
        await conn.groupRequestParticipantsUpdate(groupId, [p.jid], action);
        successCount++;
      } catch (e) {
        errors.push(`- ${p.jid}: ${e.message || e}`);
        console.error(`[ERRORE] ${action} richiesta per ${p.jid}:`, e);
      }
    }
    return { successCount, errors };
  }

  if (!args[0]) {
    const text = `📌 *Richieste in sospeso:* ${pending.length}\n\nScegli un'opzione qui sotto:`;
    return await conn.sendMessage(
      m.chat,
      {
        text,
        footer: '🛠 Gestione richieste gruppo',
        buttons: [
          { buttonId: `${usedPrefix}${command} accetta`, buttonText: { displayText: "✅ Accetta tutte" }, type: 1 },
          { buttonId: `${usedPrefix}${command} rifiuta`, buttonText: { displayText: "❌ Rifiuta tutte" }, type: 1 }
        ],
        headerType: 1,
      },
      { quoted: m }
    );
  }

  if (!isNaN(args[0])) {
    const count = Math.min(Number(args[0]), pending.length);
    const toApprove = pending.slice(0, count);
    const { successCount, errors } = await updateRequests(toApprove, 'approve');
    let reply = `✅ Accettate ${successCount} richieste (su ${count} richieste richieste).`;
    if (errors.length) reply += `\n⚠️ Errori su alcune richieste:\n${errors.join('\n')}`;
    return m.reply(reply);
  }

  if (args[0] === 'accetta') {
    const { successCount, errors } = await updateRequests(pending, 'approve');
    let reply = `✅ Accettate ${successCount} richieste con successo.`;
    if (errors.length) reply += `\n⚠️ Errori su alcune richieste:\n${errors.join('\n')}`;
    return m.reply(reply);
  }

  if (args[0] === 'rifiuta') {
    const { successCount, errors } = await updateRequests(pending, 'reject');
    let reply = `❌ Rifiutate ${successCount} richieste con successo.`;
    if (errors.length) reply += `\n⚠️ Errori su alcune richieste:\n${errors.join('\n')}`;
    return m.reply(reply);
  }

  return m.reply("❓ Comando non riconosciuto. Usa senza argomenti per vedere le opzioni.");
}

handler.command = ['richieste']
handler.tags = ['gruppo']
handler.help = ['richieste - gestisci tutte le richieste in sospeso o un numero specifico']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler