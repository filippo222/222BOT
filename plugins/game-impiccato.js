import fs from 'fs';

// Database e configurazione
const CLASSIFICA_FILE = './impiccato_classifica.json';
const LETTERE_CLASSIFICA_FILE = './impiccato_lettere_classifica.json';
[!fs.existsSync(CLASSIFICA_FILE) && fs.writeFileSync(CLASSIFICA_FILE, '{}')]
[!fs.existsSync(LETTERE_CLASSIFICA_FILE) && fs.writeFileSync(LETTERE_CLASSIFICA_FILE, '{}')]

// Lista parole migliorata (400+)
const parole = [
  // Animali (50)
  "cane", "gatto", "leone", "tigre", "orso", "lupo", "volpe", "elefante", "giraffa", "scimmia",
  "canguro", "koala", "panda", "rinoceronte", "ippopotamo", "coccodrillo", "alligatore", "serpente", "lucertola", "camaleonte",
  "pappagallo", "aquila", "falco", "civetta", "piccione", "pinguino", "pellicano", "fenicottero", "pavone", "colibrì",
  "delfino", "balena", "squalo", "orca", "foca", "lontra", "castoro", "riccio", "istrice", "tartaruga",
  "rana", "rospo", "salamandra", "tritone", "medusa", "polpo", "calamaro", "aragosta", "granchio", "gambero",

  // Cibo e cucina (50)
  "pizza", "pasta", "risotto", "lasagna", "ravioli", "gnocchi", "carbonara", "amatriciana", "tiramisu", "gelato",
  "cioccolato", "biscotto", "torta", "panino", "hamburger", "hotdog", "patatine", "insalata", "minestra", "zuppa",
  "sushi", "sashimi", "tempura", "ramen", "udon", "paella", "taco", "burrito", "guacamole", "hummus",
  "kebab", "gyros", "falafel", "couscous", "tajine", "curry", "naan", "samosa", "kimchi", "bibimbap",
  "fondue", "raclette", "quiche", "croissant", "baguette", "pretzel", "waffle", "pancake", "muffin", "donut",

  // Tecnologia (30)
  "computer", "smartphone", "tablet", "televisore", "monitor", "tastiera", "mouse", "stampante", "scanner", "router",
  "modem", "drone", "robot", "satellite", "telescopio", "microscopio", "cuffie", "altoparlante", "microfono", "webcam",
  "batteria", "caricatore", "adattatore", "processore", "memoria", "disco", "ssd", "usb", "bluetooth", "wifi",

  // Sport (30)
  "calcio", "basket", "tennis", "volley", "rugby", "golf", "hockey", "cricket", "baseball", "softball",
  "atletica", "nuoto", "ciclismo", "boxe", "judo", "karate", "taekwondo", "ginnastica", "sci", "snowboard",
  "surf", "skateboard", "arrampicata", "badminton", "pingpong", "scherma", "canoa", "voga", "triathlon", "maratona",

  // Musica (30)
  "pianoforte", "chitarra", "violino", "viola", "violoncello", "contrabbasso", "arpa", "flauto", "clarinetto", "oboe",
  "fagotto", "tromba", "trombone", "corno", "tuba", "sassofono", "batteria", "xilofono", "marimba", "tamburo",
  "armonica", "mandolino", "banjo", "ukulele", "liuto", "sitar", "didgeridoo", "ocarina", "kalimba", "theremin",

  // Geografia (50)
  "italia", "francia", "spagna", "portogallo", "germania", "olanda", "belgio", "svizzera", "austria", "grecia",
  "norvegia", "svezia", "finlandia", "danimarca", "islanda", "russia", "cina", "giappone", "india", "brasile",
  "argentina", "messico", "canada", "australia", "nuovazelanda", "egitto", "marocco", "sudafrica", "kenya", "etiopia",
  "roma", "milano", "napoli", "venezia", "firenze", "parigi", "londra", "berlino", "madrid", "barcellona",
  "newyork", "losangeles", "chicago", "miami", "toronto", "sydney", "tokyo", "pechino", "mumbai", "riodejaneiro",

  // Professioni (30)
  "medico", "infermiere", "ingegnere", "architetto", "avvocato", "giudice", "poliziotto", "vigile", "pompiere", "militare",
  "insegnante", "professore", "ricercatore", "scienziato", "astronomo", "fisico", "chimico", "biologo", "geologo", "meteorologo",
  "cuoco", "panettiere", "macellaio", "pescivendolo", "barista", "cameriere", "fattorino", "tassista", "autista", "pilota",

  // Veicoli (20)
  "automobile", "motocicletta", "bicicletta", "scooter", "camion", "autobus", "pullman", "tram", "treno", "metropolitana",
  "aereo", "elicottero", "dirigibile", "nave", "yacht", "veliero", "sottomarino", "motonave", "hovercraft", "razzo",

  // Casa e arredamento (30)
  "divano", "tavolo", "sedia", "poltrona", "letto", "armadio", "comodino", "libreria", "scrivania", "mensola",
  "tappeto", "tenda", "cuscino", "coperta", "materasso", "lampada", "lampadario", "specchio", "quadro", "scultura",
  "cucina", "frigorifero", "forno", "lavastoviglie", "lavatrice", "asciugatrice", "televisore", "stereo", "ventilatore", "condizionatore",

  // Natura (30)
  "montagna", "collina", "valle", "pianura", "altopiano", "scogliera", "spiaggia", "duna", "deserto", "oasi",
  "foresta", "bosco", "giungla", "palude", "tundra", "ghiacciaio", "vulcano", "geyser", "cascata", "lago",
  "fiume", "torrente", "delta", "estuario", "laguna", "isola", "arcipelago", "penisola", "baia", "fiordo",

  // Corpo umano (20)
  "testa", "occhio", "naso", "orecchio", "bocca", "lingua", "dente", "collo", "spalla", "braccio",
  "gomito", "polso", "mano", "dito", "petto", "schiena", "stomaco", "gamba", "ginocchio", "piede",

  // Vestiti e accessori (20)
  "maglietta", "camicia", "felpa", "giacca", "cappotto", "pantalone", "jeans", "gonna", "vestito", "cappello",
  "scarpa", "stivale", "sandalo", "ciabatta", "occhiali", "orologio", "cintura", "borsa", "zaino", "sciarpa"
];

const giochi = {};

function disegnaParola(parola, lettereUsate) {
  return parola.split('').map(l => lettereUsate.includes(l) ? l : '_').join(' ');
}

function createAlphabetButtons(usate = []) {
  const alfabeto = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const buttons = [];
  
  // Prima riga (A-I)
  buttons.push(
    ...alfabeto.slice(0, 9).map(l => ({
      buttonId: `implett ${l}`,
      buttonText: { displayText: usate.includes(l) ? `[${l.toUpperCase()}]` : l.toUpperCase() },
      type: 1
    }))
  );
  
  // Seconda riga (J-R)
  buttons.push(
    ...alfabeto.slice(9, 18).map(l => ({
      buttonId: `implett ${l}`,
      buttonText: { displayText: usate.includes(l) ? `[${l.toUpperCase()}]` : l.toUpperCase() },
      type: 1
    }))
  );
  
  // Terza riga (S-Z)
  buttons.push(
    ...alfabeto.slice(18).map(l => ({
      buttonId: `implett ${l}`,
      buttonText: { displayText: usate.includes(l) ? `[${l.toUpperCase()}]` : l.toUpperCase() },
      type: 1
    }))
  );
  
  // Pulsanti azione
  buttons.push(
    {
      buttonId: 'impindov',
      buttonText: { displayText: '🔍 Indovina' },
      type: 1
    },
    {
      buttonId: 'imphint',
      buttonText: { displayText: '💡 Suggerimento' },
      type: 1
    },
    {
      buttonId: 'impstop',
      buttonText: { displayText: '⏹️ Termina' },
      type: 1
    }
  );
  
  return buttons;
}

const handler = async (m, { conn, usedPrefix, command, args }) => {
  const chatId = m.chat;
  
  try {
    switch (command.toLowerCase()) {
      case 'impiccato':
        if (giochi[chatId]) {
          return conn.sendMessage(chatId, {
            text: "⚠️ C'è già una partita in corso!",
            buttons: [{ 
              buttonId: `${usedPrefix}impstop`, 
              buttonText: { displayText: 'Termina partita' } 
            }]
          }, { quoted: m });
        }

        const parola = parole[Math.floor(Math.random() * parole.length)].toLowerCase();
        giochi[chatId] = {
          parola,
          usate: [],
          errori: 0,
          maxErrori: 8,
          hintUsed: false
        };

        const buttons = createAlphabetButtons();
        return conn.sendMessage(chatId, {
          text: `🕹️ *Impiccato*\n\n📝 Parola: ${disegnaParola(parola, [])}\n❌ Errori: 0/8\n🔠 Lettere usate: Nessuna`,
          footer: 'Premi una lettera per giocare',
          buttons: buttons,
          headerType: 1
        }, { quoted: m });

      case 'implett':
        if (!giochi[chatId]) {
          return conn.reply(chatId, "❌ Nessuna partita in corso. Usa */impiccato* per iniziare.", m);
        }

        const lettera = args[0]?.toLowerCase();
        if (!lettera || !/^[a-z]$/.test(lettera)) {
          return conn.reply(chatId, "❗ Devi inserire una singola lettera (a-z)", m);
        }

        const gioco = giochi[chatId];
        if (gioco.usate.includes(lettera)) {
          return conn.reply(chatId, `🔁 Lettera "${lettera.toUpperCase()}" già usata!`, m);
        }

        gioco.usate.push(lettera);

        // Gestione lettera corretta/errata
        if (gioco.parola.includes(lettera)) {
          // Aggiorna classifica lettere
          const lettereClassifica = JSON.parse(fs.readFileSync(LETTERE_CLASSIFICA_FILE));
          lettereClassifica[m.sender] = (lettereClassifica[m.sender] || 0) + 1;
          fs.writeFileSync(LETTERE_CLASSIFICA_FILE, JSON.stringify(lettereClassifica));
        } else {
          gioco.errori++;
          if (gioco.errori >= gioco.maxErrori) {
            delete giochi[chatId];
            return conn.sendMessage(chatId, {
              text: `💀 *Hai perso!*\n\nLa parola era: *${gioco.parola.toUpperCase()}*`,
              buttons: [{
                buttonId: `${usedPrefix}impiccato`,
                buttonText: { displayText: '🔄 Nuova partita' }
              }]
            }, { quoted: m });
          }
        }

        // Controlla vittoria
        const stato = disegnaParola(gioco.parola, gioco.usate);
        if (!stato.includes('_')) {
          // Aggiorna classifica
          const classifica = JSON.parse(fs.readFileSync(CLASSIFICA_FILE));
          classifica[m.sender] = (classifica[m.sender] || 0) + 1;
          fs.writeFileSync(CLASSIFICA_FILE, JSON.stringify(classifica));

          delete giochi[chatId];
          return conn.sendMessage(chatId, {
            text: `🎉 *Hai vinto!*\n\nParola: *${gioco.parola.toUpperCase()}*\nErrori: ${gioco.errori}`,
            buttons: [{
              buttonId: `${usedPrefix}impiccato`,
              buttonText: { displayText: '🔄 Nuova partita' }
            }]
          }, { quoted: m });
        }

        return conn.sendMessage(chatId, {
          text: `🎮 *Impiccato*\n\n📝 Parola: ${stato}\n❌ Errori: ${gioco.errori}/8\n🔠 Lettere usate: ${gioco.usate.join(', ') || 'Nessuna'}`,
          buttons: createAlphabetButtons(gioco.usate),
          headerType: 1
        }, { quoted: m });

      case 'impindov':
        if (!giochi[chatId]) {
          return conn.reply(chatId, "❌ Nessuna partita in corso.", m);
        }

        const guess = args.join(' ')?.toLowerCase();
        if (!guess) {
          return conn.reply(chatId, "✍️ Scrivi la parola che vuoi indovinare:", m);
        }

        const game = giochi[chatId];
        if (guess === game.parola) {
          // Aggiorna classifica
          const classifica = JSON.parse(fs.readFileSync(CLASSIFICA_FILE));
          classifica[m.sender] = (classifica[m.sender] || 0) + 1;
          fs.writeFileSync(CLASSIFICA_FILE, JSON.stringify(classifica));

          delete giochi[chatId];
          return conn.sendMessage(chatId, {
            text: `🎉 *Hai indovinato!*\n\nLa parola era: *${game.parola.toUpperCase()}*`,
            buttons: [{
              buttonId: `${usedPrefix}impiccato`,
              buttonText: { displayText: '🔄 Nuova partita' }
            }]
          }, { quoted: m });
        } else {
          game.errori++;
          if (game.errori >= game.maxErrori) {
            delete giochi[chatId];
            return conn.sendMessage(chatId, {
              text: `💀 *Hai perso!*\n\nLa parola era: *${game.parola.toUpperCase()}*`,
              buttons: [{
                buttonId: `${usedPrefix}impiccato`,
                buttonText: { displayText: '🔄 Nuova partita' }
              }]
            }, { quoted: m });
          }
          return conn.reply(chatId, `❌ Sbagliato! Errori: ${game.errori}/8`, m);
        }

      case 'imphint':
        if (!giochi[chatId]) {
          return conn.reply(chatId, "❌ Nessuna partita in corso.", m);
        }

        const currentGame = giochi[chatId];
        if (currentGame.hintUsed) {
          return conn.reply(chatId, "⚠️ Hai già usato il suggerimento!", m);
        }

        const lettereNascoste = currentGame.parola.split('')
          .filter(l => !currentGame.usate.includes(l));
        
        if (lettereNascoste.length === 0) {
          return conn.reply(chatId, "ℹ️ Hai già scoperto tutte le lettere!", m);
        }

        const hintLetter = lettereNascoste[Math.floor(Math.random() * lettereNascoste.length)];
        currentGame.hintUsed = true;

        return conn.reply(chatId, `💡 Suggerimento: La parola contiene la lettera *${hintLetter.toUpperCase()}*`, m);

      case 'impstop':
        if (!giochi[chatId]) {
          return conn.reply(chatId, "⚠️ Nessuna partita in corso.", m);
        }

        const parolaCorrente = giochi[chatId].parola;
        delete giochi[chatId];
        return conn.sendMessage(chatId, {
          text: `🛑 Partita interrotta\n\nLa parola era: *${parolaCorrente.toUpperCase()}*`,
          buttons: [{
            buttonId: `${usedPrefix}impiccato`,
            buttonText: { displayText: '🔄 Nuova partita' }
          }]
        }, { quoted: m });

      case 'impclassifica':
        if (!fs.existsSync(CLASSIFICA_FILE)) {
          return conn.reply(chatId, "📊 Classifica non disponibile", m);
        }

        const data = JSON.parse(fs.readFileSync(CLASSIFICA_FILE));
        const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
        
        let text = '🏆 *Classifica Impiccato*\n\n';
        for (let i = 0; i < Math.min(5, entries.length); i++) {
          const [id, score] = entries[i];
          text += `${i+1}. @${id.split('@')[0]} - ${score} vittorie\n`;
        }

        return conn.sendMessage(chatId, { 
          text, 
          mentions: entries.slice(0,5).map(e => e[0])
        }, { quoted: m });
    }
  } catch (error) {
    console.error('Errore:', error);
    return conn.reply(chatId, "❌ Si è verificato un errore. Riprova.", m);
  }
};

handler.help = ['impiccato'].map(v => v + ' - Gioca all\'impiccato');
handler.tags = ['game'];
handler.command = /^(impiccato|implett|impindov|imphint|impstop|impclassifica)$/i;
handler.group = true;

export default handler;