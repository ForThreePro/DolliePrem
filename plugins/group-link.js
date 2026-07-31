var handler = async (m, { conn, args }) => {

let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)

conn.reply(m.chat, `🍓 *ENLACE DEL GRUPO* 🍓

╭─「 *INFO DEL GRUPO* 」─╮
│ *ENLACE* : ${link}
│ *ESTADO* : Activo
╰─────────────

> *Comparte con cuidado fresita* 😘 No se lo pases a cualquiera`, m, { detectLink: true })

}
handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler