import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, command, args, isAdmin }) => {
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  if (chat.welcome == null) chat.welcome = true
  if (chat.bye == null) chat.bye = true

  let type = command.toLowerCase()
  let accion = args[0]?.toLowerCase()

  if (!accion) {
    let w = chat.welcome? '✨ ON' : '💫 OFF'
    let b = chat.bye? '✨ ON' : '💫 OFF'
    return conn.reply(m.chat, `╭─🎀─❒ *『 𝗗𝗢𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮
│
│ ✨ *Panel de Bienvenida*
│
│ 🎀 1. Bienvenidas : ${w}
│ 🎀 2. Despedidas : ${b}
│
│ *Comandos*
│.welcome on /.welcome off
│.bye on /.bye off
╰─────────────────────────╯`, m)
  }

  if (m.isGroup &&!isAdmin) return m.reply('❄️ *SOLO ADMINS* ❄️')

  let isEnable = accion === 'on'
  chat[type] = isEnable

  let estadoTexto = isEnable? 'activadito ✨' : 'desactivadito 💫'
  let emoji = isEnable? '✨' : '💫'
  let statusTxt = `${emoji} *Dollie dice: config* 🎀\n\n🎀 *funcion:* ${type}\n📊 *estado:* ${estadoTexto}`

  const pathImg = join(process.cwd(), 'storage', 'img', 'antitop.jpg')
  let dollieImg = existsSync(pathImg)? readFileSync(pathImg) : null

  if (dollieImg) {
    await conn.sendMessage(m.chat, { image: dollieImg, caption: statusTxt, mentions: [m.sender] }, { quoted: m })
  } else {
    await conn.sendMessage(m.chat, { text: statusTxt, mentions: [m.sender] }, { quoted: m })
  }
}

handler.help = ['welcome on/off', 'bye on/off']
handler.tags = ['config']
handler.command = /^(welcome|bienvenida|bye|despedida)$/i
handler.admin = true
handler.group = true
export default handler