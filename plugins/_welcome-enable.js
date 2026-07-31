import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, command, args, isAdmin }) => {
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  let accion = command.toLowerCase() // on o off
  let type = args[0]?.toLowerCase()

  if (!type) {
    let w = chat.welcome? '✨ ON' : '💫 OFF'
    let b = chat.bye? '✨ ON' : '💫 OFF'
    return conn.reply(m.chat, `╭─🎀─❒ *『 𝗗𝗢𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮
│
│ ✨ *Panel de Bienvenida*
│
│ 🎀 1. Bienvenidas : ${w}
│ 🎀 2. Despedidas : ${b}
│
│ *Comandos Disponibles*
│.on welcome /.off welcome
│.on bye /.off bye
│
│ > *Dollie dice: Activa lo que quieras* 💫
╰─────────────────────────╯`, m)
  }

  let isEnable = accion === 'on'
  if (m.isGroup &&!isAdmin) return global.dfail('admin', m, conn)

  switch (type) {
    case 'welcome': case 'bienvenida':
      chat.welcome = isEnable
      break
    case 'bye': case 'despedida':
      chat.bye = isEnable
      break
    default:
      return m.reply(`💫 Tipo inválido. Usa: welcome, bye`)
  }

  const pathImg = join(process.cwd(), 'storage', 'img', 'antitop.jpg')
  let dollieImg = existsSync(pathImg)? readFileSync(pathImg) : null

  let estadoTexto = isEnable? 'activadito ✨' : 'desactivadito 💫'
  let emoji = isEnable? '✨' : '💫'

  let statusTxt = `${emoji} *Dollie dice: config* 🎀\n\n`
  statusTxt += `🎀 *funcion:* ${type}\n`
  statusTxt += `📊 *estado:* ${estadoTexto}\n\n`
  statusTxt += `✨ *Dollie bot System*`

  if (dollieImg) {
    await conn.sendMessage(m.chat, { image: dollieImg, caption: statusTxt, mentions: [m.sender] }, { quoted: m })
  } else {
    await conn.sendMessage(m.chat, { text: statusTxt, mentions: [m.sender] }, { quoted: m })
  }
}

handler.help = ['on/off welcome', 'on/off bye']
handler.tags = ['config']
handler.command = /^(on|off)$/i
handler.admin = true
handler.group = true

export default handler