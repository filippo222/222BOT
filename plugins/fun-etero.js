let handler = async (m, { text, quoted }) => {
let target = text || (quoted ? quoted.sender : null); if (!target) return m.reply('𝐌𝐞𝐧𝐳𝐢𝐨𝐧𝐚 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐚𝐩𝐨𝐥𝐞𝐭𝐚𝐧𝐨 𝐝𝐢 𝐦𝐞𝐫𝐝𝐚!!!');

let percentuale = Math.floor(Math.random() * 101);  
let messaggio = `@${target.replace(/@s.whatsapp.net/, '')} è 𝐄𝐓𝐄𝐑𝐎 🏳️ al ${percentuale}%`;  

m.reply(messaggio, null, { mentions: [target] });

};

handler.help = ['etero @tag | nome'];
handler.tags = ['calculator'];
handler.command = /^etero/i;

export default handler;