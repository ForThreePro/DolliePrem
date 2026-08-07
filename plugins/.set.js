let handler = async (m, { conn, isAdmin, command, text }) => {
    if (!m.isGroup) return m.reply('🍓 Solo en grupos')
    if (!isAdmin) return m.reply('🍓 *UPSITO* Solo admins fresita')
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]

    // ===== .setwelcome =====
    if (command === 'setwelcome') {
        if (!text) return m.reply(`🍓 *EJEMPLO:*\n.setwelcome Bienvenid@ @user a @group 🍓\n\n*VARIABLES:*\n@user = menciona a la persona\n@group = nombre del grupo\n@count = total de miembros`)
        
        chat.sWelcome = text
        return m.reply(`🍓 *LISTO FRESITA* 💕\nMensaje de bienvenida guardado\n*Vista previa:*\n${text.replace('@user','@'+m.sender.split('@')[0]).replace('@group', (await conn.groupMetadata(m.chat)).subject).replace('@count', (await conn.groupMetadata(m.chat)).participants.length)}`, m, { mentions: [m.sender] })
    }

    // ===== .setbye =====
    if (command === 'setbye') {
        if (!text) return m.reply(`🍓 *EJEMPLO:*\n.setbye @user abandonó la canasta 💔\n\n*VARIABLES:*\n@user = menciona a la persona\n@group = nombre del grupo\n@count = total de miembros`)
        
        chat.sBye = text
        return m.reply(`🍓 *LISTO FRESITA* 💕\nMensaje de despedida guardado\n\n*Vista previa:*\n${text.replace('@user','@'+m.sender.split('@')[0]).replace('@group', (await conn.groupMetadata(m.chat)).subject).replace('@count', (await conn.groupMetadata(m.chat)).participants.length)}`, m, { mentions: [m.sender] })
    }

}
handler.help = ['setwelcome', 'setbye']
handler.tags = ['group']
handler.command = ['setwelcome', 'setbye']
export default handler