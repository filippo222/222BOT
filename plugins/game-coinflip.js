const gameState = {};

async function sendBetMenu(m, conn) {
  const buttons = [
    { buttonId: 'coinflipbet_10', buttonText: { displayText: '💰 10$' }, type: 1 },
    { buttonId: 'coinflipbet_50', buttonText: { displayText: '💰 50$' }, type: 1 },
    { buttonId: 'coinflipbet_100', buttonText: { displayText: '💰 100$' }, type: 1 },
  ];

  await conn.sendMessage(m.chat, {
    text: `🪙 *TESTA O CROCE*\n\nScegli quanto vuoi puntare:\n\n💰 *Puntate Basse:* 10$, 50$, 100$\n💰 *Puntate Medie:* 500$, 1,000$, 5,000$\n💰 *Puntate Alte:* 10,000$, 50,000$, 100,000$\n💰 *Puntate Estreme:* 500,000$, 1,000,000$`,
    buttons,
    headerType: 1,
  });
}

let handler = async (m, { conn, command, args }) => {
  const user = global.db.data.users[m.sender];
  if (!user.money) user.money = 0;
  if (!user.coinflip) user.coinflip = { win: 0, lose: 0 };

  // Se il comando è solo .coinflip mostra menu puntate
  if (command === 'coinflip') {
    return sendBetMenu(m, conn);
  }
};

handler.before = async (m, { conn }) => {
  if (!m.message || !m.message.buttonsResponseMessage) return false;

  const buttonId = m.message.buttonsResponseMessage.selectedButtonId;
  const sender = m.sender;
  const user = global.db.data.users[sender];
  if (!user.money) user.money = 0;
  if (!user.coinflip) user.coinflip = { win: 0, lose: 0 };

  if (buttonId.startsWith('coinflipbet_')) {
    // Bottone puntata premuto
    const amount = parseInt(buttonId.split('_')[1]);
    if (isNaN(amount) || amount <= 0) return conn.sendMessage(m.chat, { text: '❌ Puntata non valida.' }, { quoted: m });
    if (user.money < amount) return conn.sendMessage(m.chat, { text: '💸 Non hai abbastanza soldi per questa puntata.' }, { quoted: m });

    gameState[sender] = { amount, stage: 'scelta' };

    const buttons = [
      { buttonId: 'coinflipchoose_testa', buttonText: { displayText: '🪙 Testa' }, type: 1 },
      { buttonId: 'coinflipchoose_croce', buttonText: { displayText: '🪙 Croce' }, type: 1 },
      { buttonId: 'coinflip', buttonText: { displayText: '🎯 Cambio Puntata' }, type: 1 }
    ];

    return conn.sendMessage(m.chat, {
      text: `🪙 *TESTA O CROCE*\n\nHai puntato *${amount}$*\nScegli testa o croce:\n\n🎮 Minigames | 𝐒𝐯𝐨²²² 𝐁𝚯𝐓`,
      buttons,
      headerType: 1
    }, { quoted: m });
  }

  if (buttonId.startsWith('coinflipchoose_')) {
    // Bottone scelta testa o croce premuto
    const sceltaUtente = buttonId.split('_')[1];
    const scelta = sceltaUtente.toLowerCase();

    if (!['testa', 'croce'].includes(scelta)) return false;

    const partita = gameState[sender];
    if (!partita || partita.stage !== 'scelta') return conn.sendMessage(m.chat, { text: '❌ Nessuna puntata attiva.' }, { quoted: m });

    const uscita = Math.random() < 0.5 ? 'testa' : 'croce';
    const vincita = uscita === scelta;

    let messaggio = `🪙 *TESTA O CROCE* 🪙\n\nÈ uscito: ${uscita.toUpperCase()} 🪙\nLa tua scelta: ${scelta.toUpperCase()}\n\n`;

    if (vincita) {
      user.money += partita.amount;
      user.coinflip.win++;
      messaggio += `🎉 *HAI VINTO!*\n💰 Hai guadagnato: ${partita.amount}$\n🎮 Minigames | 𝐒𝐯𝐨²²² 𝐁𝚯𝐓`;
    } else {
      user.money -= partita.amount;
      user.coinflip.lose++;
      messaggio += `💀 *HAI PERSO!*\n💸 Hai perso: ${partita.amount}$\n🎮 Minigames | 𝐒𝐯𝐨²²² 𝐁𝚯𝐓`;
    }

    delete gameState[sender];

    const buttons = [
      { buttonId: 'coinflipchoose_testa', buttonText: { displayText: '🪙 Testa' }, type: 1 },
      { buttonId: 'coinflipchoose_croce', buttonText: { displayText: '🪙 Croce' }, type: 1 },
      { buttonId: 'coinflip', buttonText: { displayText: '🎯 Cambio Puntata' }, type: 1 }
    ];

    return conn.sendMessage(m.chat, {
      text: messaggio,
      buttons,
      headerType: 1
    }, { quoted: m });
  }
  return false;
};

handler.command = ['coinflip'];
handler.tags = ['game'];
handler.help = ['coinflip'];

export default handler;