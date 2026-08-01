let handler = async (m, { conn, args, usedPrefix, command, isAdmin }) => {
    if (!isAdmin) return m.reply(`╭─🎀─❒ *『 𝗗𝗢𝗟𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮\n│ 😡 *¡Solo admins pueden!*\n╰─────────────────────────🎀`)

    let chat = global.db.data.chats[m.chat] || {}
    if (!("cuentaTime" in chat)) chat.cuentaTime = null

    if (command === 'cuentastatus') {
        if (!chat.cuentaTime) return m.reply(`╭─🎀─❒ *『 𝗗𝗢𝗟𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮\n│ 🥺 *No hay cuenta activa*\n╰─────────────────────────🎀`)

        let falta = chat.cuentaTime - Date.now()
        if (falta <= 0) {
            chat.cuentaTime = null
            await global.db.write()
            return m.reply(`*La cuenta ya terminó*`)
        }

        let d = Math.floor(falta / 86400000)
        let h = Math.floor(falta % 86400000 / 3600000)
        let min = Math.floor(falta % 3600000 / 60000)

        return m.reply(`╭─🎀─❒ *『 𝗗𝗢𝗟𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮
│ ⏰ *TIEMPO DE DOLLIE* ⏰
│
│ *Falta:* *${d}d* *${h}h* *${min}m*
│ *Me voy el:* *${new Date(chat.cuentaTime).toLocaleString('es-PE')}*
│
│ > *Aún puedo acompañarlos* 💫
╰─────────────────────────🎀`)
    }

    if (args[0] === 'cancelar') {
        chat.cuentaTime = null
        await global.db.write()
        return m.reply(`╭─🎀─❒ *『 𝗗𝗢𝗟𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮\n│ ✅ *Cuenta cancelada* ✨\n│ *Me quedo con ustedes* 🎀\n╰─────────────────────────🎀`)
    }

    if (!args[0]) return m.reply(`╭─🎀─❒ *『 𝗗𝗢𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮
│ 🥺 *Falta el tiempito*
│
│ *Uso:* *${usedPrefix}cuenta 30d*
│ *Ejemplos:* *30s* / *10m* / *2h* / *30d*
│ *Ver tiempo:* *${usedPrefix}cuentastatus*
│ *Cancelar:* *${usedPrefix}cuenta cancelar*
╰─────────────────────────🎀`)

    let time = args[0]
    let ms = 0

    if (time.endsWith('s')) ms = parseInt(time) * 1000
    else if (time.endsWith('m')) ms = parseInt(time) * 60 * 1000
    else if (time.endsWith('h')) ms = parseInt(time) * 60 * 60 * 1000
    else if (time.endsWith('d')) ms = parseInt(time) * 24 * 60 * 60 * 1000
    else return m.reply(`*Formato inválido. Usa: s, m, h, d*`)

    let exitTime = Date.now() + ms
    chat.cuentaTime = exitTime
    global.db.data.chats[m.chat] = chat
    await global.db.write()

    await m.reply(`╭─🎀─❒ *『 𝗗𝗢𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮
│ ⏰ *CUENTA INICIADA* ⏰
│
│ *Duración:* *${time}*
│ *Me despido el:* *${new Date(exitTime).toLocaleString('es-PE')}*
│
│ > *Aunque reinicien, me iré sola* 🥺
╰─────────────────────────🎀`)
}
handler.help = ['cuenta <tiempo>', 'cuentastatus']
handler.tags = ['admin']
handler.command = /^(cuenta|cuentastatus)$/i
handler.admin = true
handler.group = true
export default handler