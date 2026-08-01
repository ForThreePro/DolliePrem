let handler = async (m, { conn, command, isAdmin }) => {
    if (!isAdmin) return m.reply('❌ Solo admins')
    
    global.db.data.chats[m.chat].bannedGrupo = command === 'offbot'
    await global.db.write()
    
    m.reply(command === 'offbot' ? '🔴 Apagado' : '🟢 Prendido')
}
handler.command = ['offbot','onbot']
handler.admin = true
handler.group = true
export default handler
