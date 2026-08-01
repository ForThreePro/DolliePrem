let handler = async (m) => {
    global.db.data.chats[m.chat].bannedGrupo = false
    m.reply('🟢 Bot Prendido en este grupo')
}
handler.command = ['onbot']
handler.admin = true
handler.group = true
export default handler
