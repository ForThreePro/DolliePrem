let handler = async (m, { conn, command }) => {
    console.log('ENTRE AL PLUGIN') // Si no sale esto, el plugin no carga
    
    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = chat = {}
    
    if (command == 'offbot') {
        chat.bannedGrupo = true
        await global.db.write()
        await m.reply('🔴 Apagado')
    }
    
    if (command == 'onbot') {
        chat.bannedGrupo = false
        await global.db.write()
        await m.reply('🟢 Prendido')
    }
}

handler.command = ['offbot', 'onbot']
handler.admin = true
handler.group = true

export default handler
