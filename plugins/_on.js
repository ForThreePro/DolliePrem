let handler = async (m, { conn, command, isOwner, isAdmin }) => {
    let chat = global.db.data.chats[m.chat]
    if (!chat) chat = global.db.data.chats[m.chat] = {}
    
    // Solo owner o admin pueden usarlo
    if (!isOwner && !isAdmin) return m.reply('❌ Solo admins/owner')

    if (command === 'offbot') {
        if (chat.bannedGrupo) return m.reply('⚠️ El bot ya está apagado en este grupo')
        chat.bannedGrupo = true
        await global.db.write() // IMPORTANTE para que guarde
        await m.reply(`🔴 *Dollie Bot Apagado*\nYa no responderé comandos en este grupo.\n\nPara prenderme usa: *.onbot*`)
    }

    if (command === 'onbot') {
        if (!chat.bannedGrupo) return m.reply('⚠️ El bot ya está prendido en este grupo')
        chat.bannedGrupo = false
        await global.db.write() // IMPORTANTE para que guarde
        await m.reply(`🟢 *Dollie Bot Prendido*\nYa vuelvo a responder a todos los comandos`)
    }
}

handler.help = ['offbot', 'onbot']
handler.tags = ['owner']
handler.command = /^offbot|onbot$/i
handler.admin = true
handler.group = true

export default handler