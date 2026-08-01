let handler = m => m

handler.all = async function(m) {
    let chat = global.db.data.chats[m.chat]
    if (!chat) return

    let isOwner = global.owner.map(([number]) => number + "@s.whatsapp.net").includes(m.sender)
    let texto = (m.text || '').toLowerCase()

    // Si esta apagado y no eres owner y no es.onbot = no deja pasar nada
    if (chat.bannedGrupo &&!isOwner && texto!== '.onbot' && texto!== '#onbot') {
        return true // esto frena todo
    }
}

handler.priority = 0 // para que sea el primero
export default handler
