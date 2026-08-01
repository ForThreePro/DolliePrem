let handler = async (m, { conn, usedPrefix }) => {
    if (!m.quoted ||!m.quoted.mimetype?.includes('image'))
        return m.reply(`╭─🎀─❒ *『 𝗗𝗢𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮
│ 🥺 *¡Ups! Falta la fotito*
│
│ *Uso:* ${usedPrefix}ver
│ *Responde a una imagen* 💫
╰─────────────────────────🎀`)

    let media = await m.quoted.download()
    await conn.sendMessage(m.chat, {
        image: media,
        caption: `╭─🎀─❒ *『 𝗗𝗢𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮
│ ✨ *FOTITO REENVIADA* ✨
│
│ *Ya la pueden ver todos* 🥰
│
│ > *Enviado por:* *${m.pushName}*
╰─────────────────────────🎀`
        // viewOnce: false  <- lo quitamos para que sea normal
    }, { quoted: m })
}
handler.help = ['ver']
handler.tags = ['tools']
handler.command = /^ver$/i
handler.group = true
export default handler