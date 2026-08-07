let handler = async (m, { conn, isAdmin, command, text }) => {
    if (!m.isGroup) return m.reply('🍓 Solo en grupos')
    if (!isAdmin) return m.reply('🍓 *UPSITO* Solo admins fresita')
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]

    let groupMeta = await conn.groupMetadata(m.chat)
    let preview = (txt) => {
        return txt
       .replace('@user', '@' + m.sender.split('@')[0])
       .replace('@group', groupMeta.subject)
       .replace('@count', groupMeta.participants.length)
    }

    // =====.setwelcome =====
    if (command === 'setwelcome') {
        if (!text) return m.reply(`🍓 *EJEMPLO:*\n.setwelcome Bienvenid@ @user a @group 🍓\n\n*VARIABLES:*\n@user = menciona a la persona\n@group = nombre del grupo\n@count = total de miembros`)

        chat.sWelcome = text
        return m.reply(`🍓 *LISTO FRESITA* 💕\nMensaje de bienvenida guardado\n\n*Vista previa:*\n${preview(text)}`, m, { mentions: [m.sender] })
    }

    // =====.setbye =====
    if (command === 'setbye') {
        if (!text) return m.reply(`🍓 *EJEMPLO:*\n.setbye @user abandonó la canasta 💔\n\n*VARIABLES:*\n@user = menciona a la persona\n@group = nombre del grupo\n@count = total de miembros`)

        chat.sBye = text
        return m.reply(`🍓 *LISTO FRESITA* 💕\nMensaje de despedida guardado\n*Vista previa:*\n${preview(text)}`, m, { mentions: [m.sender] })
    }

    // =====.delwelcome =====
    if (command === 'delwelcome') {
        if (!chat.sWelcome) return m.reply('🍓 Este grupo no tiene bienvenida personalizada')
        delete chat.sWelcome
        return m.reply('🍓 *BORRADO* \nSe eliminó la bienvenida personalizada\nAhora usará la de por defecto de Fresita Bot')
    }

    // =====.delbye =====
    if (command === 'delbye') {
        if (!chat.sBye) return m.reply('🍓 Este grupo no tiene despedida personalizada')
        delete chat.sBye
        return m.reply('🍓 *BORRADO* \nSe eliminó la despedida personalizada\nAhora usará la de por defecto de Fresita Bot')
    }

}
handler.help = ['setwelcome', 'setbye', 'delwelcome', 'delbye']
handler.tags = ['group']
handler.command = ['setwelcome', 'setbye', 'delwelcome', 'delbye']
export default handler