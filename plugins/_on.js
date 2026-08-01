let handler = async (m, { conn, command }) => {
    let chat = global.db.data.chats[m.chat]
    if (command === 'offbot') {
        chat.bannedGrupo = true
        await global.db.write()
        m.reply('🔴 Apagado')
    }
    if (command === 'onbot') {
        chat.bannedGrupo = false  
        await global.db.write()
        m.reply('🟢 Prendido')
    }
}
handler.command = ['offbot','onbot']
export default handler