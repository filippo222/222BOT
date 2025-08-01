import fs from 'fs';

const CLASSIFICA_PATH = './bandieraclassifica.json';

function loadClassifica() {
  if (!fs.existsSync(CLASSIFICA_PATH)) return {};
  return JSON.parse(fs.readFileSync(CLASSIFICA_PATH));
}

function saveClassifica(classifica) {
  fs.writeFileSync(CLASSIFICA_PATH, JSON.stringify(classifica, null, 2));
}

const handler = async (m, { conn, isAdmin }) => {
  const countries = [
  { url: 'https://flagcdn.com/w320/li.png', nome: 'Liechtenstein' },
  { url: 'https://flagcdn.com/w320/sm.png', nome: 'San Marino' },
  { url: 'https://flagcdn.com/w320/ad.png', nome: 'Andorra' },
  { url: 'https://flagcdn.com/w320/mc.png', nome: 'Monaco' },
  { url: 'https://flagcdn.com/w320/va.png', nome: 'Città del Vaticano' },
  { url: 'https://flagcdn.com/w320/rs.png', nome: 'Serbia' },
  { url: 'https://flagcdn.com/w320/xk.png', nome: 'Kosovo' },
  { url: 'https://flagcdn.com/w320/cn.png', nome: 'Cina' },
  { url: 'https://flagcdn.com/w320/jp.png', nome: 'Giappone' },
  { url: 'https://flagcdn.com/w320/in.png', nome: 'India' },
  { url: 'https://flagcdn.com/w320/kr.png', nome: 'Corea del Sud' },
  { url: 'https://flagcdn.com/w320/kp.png', nome: 'Corea del Nord' },
  { url: 'https://flagcdn.com/w320/th.png', nome: 'Thailandia' },
  { url: 'https://flagcdn.com/w320/vn.png', nome: 'Vietnam' },
  { url: 'https://flagcdn.com/w320/id.png', nome: 'Indonesia' },
  { url: 'https://flagcdn.com/w320/ph.png', nome: 'Filippine' },
  { url: 'https://flagcdn.com/w320/my.png', nome: 'Malesia' },
  { url: 'https://flagcdn.com/w320/sg.png', nome: 'Singapore' },
  { url: 'https://flagcdn.com/w320/mm.png', nome: 'Myanmar' },
  { url: 'https://flagcdn.com/w320/kh.png', nome: 'Cambogia' },
  { url: 'https://flagcdn.com/w320/la.png', nome: 'Laos' },
  { url: 'https://flagcdn.com/w320/lk.png', nome: 'Sri Lanka' },
  { url: 'https://flagcdn.com/w320/np.png', nome: 'Nepal' },
  { url: 'https://flagcdn.com/w320/bt.png', nome: 'Bhutan' },
  { url: 'https://flagcdn.com/w320/bd.png', nome: 'Bangladesh' },
  { url: 'https://flagcdn.com/w320/pk.png', nome: 'Pakistan' },
  { url: 'https://flagcdn.com/w320/af.png', nome: 'Afghanistan' },
  { url: 'https://flagcdn.com/w320/ir.png', nome: 'Iran' },
  { url: 'https://flagcdn.com/w320/iq.png', nome: 'Iraq' },
  { url: 'https://flagcdn.com/w320/tr.png', nome: 'Turchia' },
  { url: 'https://flagcdn.com/w320/il.png', nome: 'Israele' },
  { url: 'https://flagcdn.com/w320/ps.png', nome: 'Palestina' },
  { url: 'https://flagcdn.com/w320/sa.png', nome: 'Arabia Saudita' },
  { url: 'https://flagcdn.com/w320/ae.png', nome: 'Emirati Arabi Uniti' },
  { url: 'https://flagcdn.com/w320/qa.png', nome: 'Qatar' },
  { url: 'https://flagcdn.com/w320/om.png', nome: 'Oman' },
  { url: 'https://flagcdn.com/w320/jo.png', nome: 'Giordania' },
  { url: 'https://flagcdn.com/w320/lb.png', nome: 'Libano' },
  { url: 'https://flagcdn.com/w320/sy.png', nome: 'Siria' },
  { url: 'https://flagcdn.com/w320/ye.png', nome: 'Yemen' },
  { url: 'https://flagcdn.com/w320/kz.png', nome: 'Kazakistan' },
  { url: 'https://flagcdn.com/w320/uz.png', nome: 'Uzbekistan' },
  { url: 'https://flagcdn.com/w320/tj.png', nome: 'Tagikistan' },
  { url: 'https://flagcdn.com/w320/kg.png', nome: 'Kirghizistan' },
  { url: 'https://flagcdn.com/w320/tm.png', nome: 'Turkmenistan' },
  { url: 'https://flagcdn.com/w320/mm.png', nome: 'Mongolia' },
  { url: 'https://flagcdn.com/w320/az.png', nome: 'Azerbaigian' },
  { url: 'https://flagcdn.com/w320/ge.png', nome: 'Georgia' },
  { url: 'https://flagcdn.com/w320/am.png', nome: 'Armenia' },
  { url: 'https://flagcdn.com/w320/kw.png', nome: 'Kuwait' },
  { url: 'https://flagcdn.com/w320/bh.png', nome: 'Bahrain' },
  { url: 'https://flagcdn.com/w320/tw.png', nome: 'Taiwan' },
  { url: 'https://flagcdn.com/w320/hk.png', nome: 'Hong Kong' },
  { url: 'https://flagcdn.com/w320/eg.png', nome: 'Egitto' },
  { url: 'https://flagcdn.com/w320/ng.png', nome: 'Nigeria' },
  { url: 'https://flagcdn.com/w320/ma.png', nome: 'Marocco' },
  { url: 'https://flagcdn.com/w320/tn.png', nome: 'Tunisia' },
  { url: 'https://flagcdn.com/w320/ke.png', nome: 'Kenya' },
  { url: 'https://flagcdn.com/w320/et.png', nome: 'Etiopia' },
  { url: 'https://flagcdn.com/w320/gh.png', nome: 'Ghana' },
  { url: 'https://flagcdn.com/w320/cm.png', nome: 'Camerun' },
  { url: 'https://flagcdn.com/w320/ci.png', nome: "Costa d'Avorio" },
  { url: 'https://flagcdn.com/w320/sn.png', nome: 'Senegal' },
  { url: 'https://flagcdn.com/w320/zm.png', nome: 'Zambia' },
  { url: 'https://flagcdn.com/w320/zw.png', nome: 'Zimbabwe' },
  { url: 'https://flagcdn.com/w320/ao.png', nome: 'Angola' },
  { url: 'https://flagcdn.com/w320/mg.png', nome: 'Madagascar' },
  { url: 'https://flagcdn.com/w320/tz.png', nome: 'Tanzania' },
  { url: 'https://flagcdn.com/w320/ug.png', nome: 'Uganda' },
  { url: 'https://flagcdn.com/w320/mz.png', nome: 'Mozambico' },
  { url: 'https://flagcdn.com/w320/rw.png', nome: 'Ruanda' },
  { url: 'https://flagcdn.com/w320/mw.png', nome: 'Malawi' },
  { url: 'https://flagcdn.com/w320/bw.png', nome: 'Botswana' },
  { url: 'https://flagcdn.com/w320/na.png', nome: 'Namibia' },
  { url: 'https://flagcdn.com/w320/sz.png', nome: 'Eswatini' },
  { url: 'https://flagcdn.com/w320/ls.png', nome: 'Lesotho' },
  { url: 'https://flagcdn.com/w320/dz.png', nome: 'Algeria' },
  { url: 'https://flagcdn.com/w320/ly.png', nome: 'Libia' },
  { url: 'https://flagcdn.com/w320/sd.png', nome: 'Sudan' },
  { url: 'https://flagcdn.com/w320/ss.png', nome: 'Sudan del Sud' },
  { url: 'https://flagcdn.com/w320/er.png', nome: 'Eritrea' },
  { url: 'https://flagcdn.com/w320/dj.png', nome: 'Gibuti' },
  { url: 'https://flagcdn.com/w320/so.png', nome: 'Somalia' },
  { url: 'https://flagcdn.com/w320/cd.png', nome: 'Repubblica Democratica del Congo' },
  { url: 'https://flagcdn.com/w320/cg.png', nome: 'Repubblica del Congo' },
  { url: 'https://flagcdn.com/w320/cf.png', nome: 'Repubblica Centrafricana' },
  { url: 'https://flagcdn.com/w320/td.png', nome: 'Ciad' },
  { url: 'https://flagcdn.com/w320/ne.png', nome: 'Niger' },
  { url: 'https://flagcdn.com/w320/ml.png', nome: 'Mali' },
  { url: 'https://flagcdn.com/w320/bf.png', nome: 'Burkina Faso' },
  { url: 'https://flagcdn.com/w320/mr.png', nome: 'Mauritania' },
  { url: 'https://flagcdn.com/w320/gn.png', nome: 'Guinea' },
  { url: 'https://flagcdn.com/w320/gw.png', nome: 'Guinea-Bissau' },
  { url: 'https://flagcdn.com/w320/sl.png', nome: 'Sierra Leone' },
  { url: 'https://flagcdn.com/w320/lr.png', nome: 'Liberia' },
  { url: 'https://flagcdn.com/w320/tg.png', nome: 'Togo' },
  { url: 'https://flagcdn.com/w320/bj.png', nome: 'Benin' },
  { url: 'https://flagcdn.com/w320/ga.png', nome: 'Gabon' },
  { url: 'https://flagcdn.com/w320/gq.png', nome: 'Guinea Equatoriale' },
  { url: 'https://flagcdn.com/w320/cv.png', nome: 'Capo Verde' },
  { url: 'https://flagcdn.com/w320/gm.png', nome: 'Gambia' },
  { url: 'https://flagcdn.com/w320/bi.png', nome: 'Burundi' },
  { url: 'https://flagcdn.com/w320/km.png', nome: 'Comore' },
  { url: 'https://flagcdn.com/w320/mu.png', nome: 'Mauritius' },
  { url: 'https://flagcdn.com/w320/sc.png', nome: 'Seychelles' },
  { url: 'https://flagcdn.com/w320/us.png', nome: 'Stati Uniti' },
  { url: 'https://flagcdn.com/w320/ca.png', nome: 'Canada' },
  { url: 'https://flagcdn.com/w320/mx.png', nome: 'Messico' },
  { url: 'https://flagcdn.com/w320/br.png', nome: 'Brasile' },
  { url: 'https://flagcdn.com/w320/ar.png', nome: 'Argentina' },
  { url: 'https://flagcdn.com/w320/cl.png', nome: 'Cile' },
  { url: 'https://flagcdn.com/w320/co.png', nome: 'Colombia' },
  { url: 'https://flagcdn.com/w320/pe.png', nome: 'Perù' },
  { url: 'https://flagcdn.com/w320/ve.png', nome: 'Venezuela' },
  { url: 'https://flagcdn.com/w320/cu.png', nome: 'Cuba' },
  { url: 'https://flagcdn.com/w320/bo.png', nome: 'Bolivia' },
  { url: 'https://flagcdn.com/w320/ec.png', nome: 'Ecuador' },
  { url: 'https://flagcdn.com/w320/uy.png', nome: 'Uruguay' },
  { url: 'https://flagcdn.com/w320/py.png', nome: 'Paraguay' },
  { url: 'https://flagcdn.com/w320/cr.png', nome: 'Costa Rica' },
  { url: 'https://flagcdn.com/w320/pa.png', nome: 'Panama' },
  { url: 'https://flagcdn.com/w320/do.png', nome: 'Repubblica Dominicana' },
  { url: 'https://flagcdn.com/w320/jm.png', nome: 'Giamaica' },
  { url: 'https://flagcdn.com/w320/gt.png', nome: 'Guatemala' },
  { url: 'https://flagcdn.com/w320/hn.png', nome: 'Honduras' },
  { url: 'https://flagcdn.com/w320/ni.png', nome: 'Nicaragua' },
  { url: 'https://flagcdn.com/w320/sv.png', nome: 'El Salvador' },
  { url: 'https://flagcdn.com/w320/bz.png', nome: 'Belize' },
  { url: 'https://flagcdn.com/w320/ht.png', nome: 'Haiti' },
  { url: 'https://flagcdn.com/w320/gy.png', nome: 'Guyana' },
  { url: 'https://flagcdn.com/w320/sr.png', nome: 'Suriname' },
  { url: 'https://flagcdn.com/w320/gf.png', nome: 'Guyana Francese' },
  { url: 'https://flagcdn.com/w320/tt.png', nome: 'Trinidad e Tobago' },
  { url: 'https://flagcdn.com/w320/bb.png', nome: 'Barbados' },
  { url: 'https://flagcdn.com/w320/lc.png', nome: 'Santa Lucia' },
  { url: 'https://flagcdn.com/w320/dm.png', nome: 'Dominica' },
  { url: 'https://flagcdn.com/w320/bs.png', nome: 'Bahamas' },
  { url: 'https://flagcdn.com/w320/au.png', nome: 'Australia' },
  { url: 'https://flagcdn.com/w320/nz.png', nome: 'Nuova Zelanda' },
  { url: 'https://flagcdn.com/w320/fj.png', nome: 'Fiji' },
  { url: 'https://flagcdn.com/w320/pg.png', nome: 'Papua Nuova Guinea' },
  { url: 'https://flagcdn.com/w320/nc.png', nome: 'Nuova Caledonia' },
  { url: 'https://flagcdn.com/w320/pr.png', nome: 'Porto Rico' },
  { url: 'https://flagcdn.com/w320/gl.png', nome: 'Groenlandia' },
// Europa
{ url: 'https://flagcdn.com/w320/al.png', nome: 'Albania' },
{ url: 'https://flagcdn.com/w320/at.png', nome: 'Austria' },
{ url: 'https://flagcdn.com/w320/be.png', nome: 'Belgio' },
{ url: 'https://flagcdn.com/w320/ba.png', nome: 'Bosnia ed Erzegovina' },
{ url: 'https://flagcdn.com/w320/bg.png', nome: 'Bulgaria' },
{ url: 'https://flagcdn.com/w320/hr.png', nome: 'Croazia' },
{ url: 'https://flagcdn.com/w320/cy.png', nome: 'Cipro' },
{ url: 'https://flagcdn.com/w320/cz.png', nome: 'Repubblica Ceca' },
{ url: 'https://flagcdn.com/w320/dk.png', nome: 'Danimarca' },
{ url: 'https://flagcdn.com/w320/ee.png', nome: 'Estonia' },
{ url: 'https://flagcdn.com/w320/fi.png', nome: 'Finlandia' },
{ url: 'https://flagcdn.com/w320/fr.png', nome: 'Francia' },
{ url: 'https://flagcdn.com/w320/de.png', nome: 'Germania' },
{ url: 'https://flagcdn.com/w320/gr.png', nome: 'Grecia' },
{ url: 'https://flagcdn.com/w320/hu.png', nome: 'Ungheria' },
{ url: 'https://flagcdn.com/w320/is.png', nome: 'Islanda' },
{ url: 'https://flagcdn.com/w320/ie.png', nome: 'Irlanda' },
{ url: 'https://flagcdn.com/w320/it.png', nome: 'Italia' },
{ url: 'https://flagcdn.com/w320/lv.png', nome: 'Lettonia' },
{ url: 'https://flagcdn.com/w320/lt.png', nome: 'Lituania' },
{ url: 'https://flagcdn.com/w320/lu.png', nome: 'Lussemburgo' },
{ url: 'https://flagcdn.com/w320/mt.png', nome: 'Malta' },
{ url: 'https://flagcdn.com/w320/md.png', nome: 'Moldavia' },
{ url: 'https://flagcdn.com/w320/me.png', nome: 'Montenegro' },
{ url: 'https://flagcdn.com/w320/nl.png', nome: 'Paesi Bassi' },
{ url: 'https://flagcdn.com/w320/mk.png', nome: 'Macedonia del Nord' },
{ url: 'https://flagcdn.com/w320/no.png', nome: 'Norvegia' },
{ url: 'https://flagcdn.com/w320/pl.png', nome: 'Polonia' },
{ url: 'https://flagcdn.com/w320/pt.png', nome: 'Portogallo' },
{ url: 'https://flagcdn.com/w320/ro.png', nome: 'Romania' },
{ url: 'https://flagcdn.com/w320/sk.png', nome: 'Slovacchia' },
{ url: 'https://flagcdn.com/w320/si.png', nome: 'Slovenia' },
{ url: 'https://flagcdn.com/w320/es.png', nome: 'Spagna' },
{ url: 'https://flagcdn.com/w320/se.png', nome: 'Svezia' },
{ url: 'https://flagcdn.com/w320/ch.png', nome: 'Svizzera' },
{ url: 'https://flagcdn.com/w320/ua.png', nome: 'Ucraina' },
{ url: 'https://flagcdn.com/w320/gb.png', nome: 'Regno Unito' },

// Territori dipendenti e altre entità
{ url: 'https://flagcdn.com/w320/fo.png', nome: 'Isole Faroe' },
{ url: 'https://flagcdn.com/w320/gg.png', nome: 'Guernsey' },
{ url: 'https://flagcdn.com/w320/im.png', nome: 'Isola di Man' },
{ url: 'https://flagcdn.com/w320/je.png', nome: 'Jersey' },
{ url: 'https://flagcdn.com/w320/ax.png', nome: 'Isole Åland' },
{ url: 'https://flagcdn.com/w320/sj.png', nome: 'Svalbard e Jan Mayen' },

// Paesi mancanti da altri continenti
{ url: 'https://flagcdn.com/w320/by.png', nome: 'Bielorussia' },
{ url: 'https://flagcdn.com/w320/mn.png', nome: 'Mongolia' }, // (correzione, nella lista originale c'era un doppione con codice mm)
{ url: 'https://flagcdn.com/w320/mv.png', nome: 'Maldive' },
{ url: 'https://flagcdn.com/w320/ws.png', nome: 'Samoa' },
{ url: 'https://flagcdn.com/w320/to.png', nome: 'Tonga' },
{ url: 'https://flagcdn.com/w320/vu.png', nome: 'Vanuatu' },
{ url: 'https://flagcdn.com/w320/sb.png', nome: 'Isole Salomone' },
{ url: 'https://flagcdn.com/w320/ki.png', nome: 'Kiribati' },
{ url: 'https://flagcdn.com/w320/nr.png', nome: 'Nauru' },
{ url: 'https://flagcdn.com/w320/pw.png', nome: 'Palau' },
{ url: 'https://flagcdn.com/w320/fm.png', nome: 'Micronesia' },
{ url: 'https://flagcdn.com/w320/mh.png', nome: 'Isole Marshall' },
{ url: 'https://flagcdn.com/w320/tl.png', nome: 'Timor Est' },
{ url: 'https://flagcdn.com/w320/bn.png', nome: 'Brunei' },
  { url: 'https://flagcdn.com/w320/gi.png', nome: 'Gibilterra' },
  { url: 'https://flagcdn.com/w320/aq.png', nome: 'Antartide' },
  { url: 'https://flagcdn.com/w320/eh.png', nome: 'Sahara Occidentale' }
];

 const normalize = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  if (!global.bandieraGame) global.bandieraGame = {};

  if (m.text?.toLowerCase() === ".skipbandiera") {
    const game = global.bandieraGame[m.chat];
    if (!game) return m.reply("⚠️ Nessuna partita in corso.");
    if (!isAdmin && !m.fromMe) return m.reply("🔴 Solo admin!");
    clearTimeout(game.timeout);
    delete global.bandieraGame[m.chat];
    return conn.reply(m.chat, `⛔️ Gioco terminato.\nLa risposta era: *${game.rispostaOriginale}*`, m);
  }

  if (global.bandieraGame[m.chat]) return m.reply("⚠️ Partita già in corso!");

  const bandiera = countries[Math.floor(Math.random() * countries.length)];
  const game = {
    risposta: normalize(bandiera.nome),
    rispostaOriginale: bandiera.nome,
    startTime: Date.now(),
    tentativi: {},
  };

  const msg = await conn.sendMessage(m.chat, {
    image: { url: bandiera.url },
    caption: `🎌 *Indovina la nazione!*\n📩 Rispondi a questo messaggio con il nome\n🕐 Tempo: 60s\n💡 Scrivi "indizio" per un aiuto\n❌ Usa *.skipbandiera* per annullare`
  }, { quoted: m });

  game.msgId = msg.key.id;

  game.timeout = setTimeout(() => {
    conn.reply(m.chat, `⏰ Tempo scaduto!\nLa risposta era: *${game.rispostaOriginale}*`);
    delete global.bandieraGame[m.chat];
  }, 60000);

  global.bandieraGame[m.chat] = game;
};

handler.before = async (m, { conn }) => {
  const game = global.bandieraGame?.[m.chat];
  if (!m.isGroup || !game || m.key.fromMe) return;

  const quotedMsgId = m.message?.extendedTextMessage?.contextInfo?.stanzaId || m.quoted?.id;
  if (quotedMsgId !== game.msgId) return;

  const normalize = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const text = normalize(m.text || '');
  const sender = m.sender;

  if (text === "indizio") {
    return conn.reply(m.chat, `🧩 *Indizio:*\n• Inizia con *${game.rispostaOriginale[0]}*\n• ${game.rispostaOriginale.length} lettere`, m);
  }

  game.tentativi[sender] = (game.tentativi[sender] || 0) + 1;

  if (text === game.risposta) {
    clearTimeout(game.timeout);
    const seconds = Math.floor((Date.now() - game.startTime) / 1000);
    const reward = 20 + Math.floor(Math.random() * 20);
    const message = `🎉 *CORRETTO!*\n🌍 Era: *${game.rispostaOriginale}*\n⏱ Tempo: ${seconds}s\n💰 +${reward} punti`;

    // aggiorna classifica
    const classifica = loadClassifica();
    classifica[sender] = (classifica[sender] || 0) + 1;
    saveClassifica(classifica);

    delete global.bandieraGame[m.chat];
    return conn.reply(m.chat, message, m);
  }

  const tentativiRimasti = 3 - game.tentativi[sender];
  if (tentativiRimasti > 0) {
    return conn.reply(m.chat, `❌ Sbagliato! Tentativi rimasti: ${tentativiRimasti}`, m);
  } else {
    delete global.bandieraGame[m.chat];
    return conn.reply(m.chat, `❌ Hai esaurito i tentativi!\nLa risposta era: *${game.rispostaOriginale}*`, m);
  }
};

handler.help = ['bandiera'];
handler.tags = ['game'];
handler.command = /^bandiera$/i;
handler.group = true;

export default handler;