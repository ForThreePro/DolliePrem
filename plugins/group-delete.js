let handler = async (m, { conn, usedPrefix, command }) => {

if (!m.quoted) return conn.reply(m.chat, `🍓 *AY NOOO* 🍓

╭─「 *INSTRUCCION* 」─╮
│ *Cita el mensaje que quieres eliminar*
│ *Ejemplo* : Responde +.${command}
╰─────────────

> *Tienes que responder al mensaje fresita* 😘`, m)

try {
    // Caso 1: Mensaje de otro usuario
    let key = m.quoted.vM.key
    await conn.sendMessage(m.chat, { delete: key })
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

} catch (e) {
    // Caso 2: Fallback si falla
    try {
        let delet = m.quoted.vM.key
        await conn.sendMessage(m.chat, { delete: delet })
    } catch {
        return conn.reply(m.chat, `❌ *ERROR* : No se pudo eliminar el mensaje

> *Ay nooo, no tengo permisos o el mensaje es muy viejo* 😿`, m)
    }
}}

handler.help = ['delete']
handler.tags = ['group']
handler.command = ['del','delete','d']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler