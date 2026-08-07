let handler = async (m, { conn, usedPrefix, command }) => {

    try {
        m.reply('「❀」 Reiniciando El Bot....')
        setTimeout(() => {
            process.exit(0)
        }, 3000) 
    } catch (error) {
        console.log(error)
        conn.reply(m.chat, `${error}`, m)
    }
}

handler.help = ['reset']
handler.tags = ['owner']
handler.command = ['reset', 'reiniciar'] 
handler.rowner = true

export default handler