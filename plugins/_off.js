let handler = async (m) => {
    global.db.data.chats[m.chat].bannedGrupo = true
    m.reply('🔴 Bot Apagado en este grupo')
}
handler.command = ['offbot']
handler.admin = true
handler.group = true
export default handler
