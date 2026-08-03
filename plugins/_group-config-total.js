let handler = async (m, { conn, command, usedPrefix, text, isAdmin, isBotAdmin }) => {
    
    if (!m.isGroup) return m.reply(`❌ Este comando solo funciona en grupos`)
    if (!isAdmin) return m.reply(`❌ Solo admins pueden usar este comando`)

    // ===== 1. CAMBIAR DESCRIPCION =====
    if (command === 'gpdesc') {
        if (!isBotAdmin) return m.reply(`❌ Necesito ser admin para cambiar la descripción`)
        if (!text) return m.reply(`❌ Falta el texto\nEjemplo: ${usedPrefix}gpdesc Bienvenidos al grupo`)
        
        await conn.groupUpdateDescription(m.chat, text)
        return m.reply(`✅ Descripción actualizada\n\nNueva descripción:\n${text}`)
    }

    // ===== 2. CAMBIAR NOMBRE =====
    if (command === 'gpname') {
        if (!isBotAdmin) return m.reply(`❌ Necesito ser admin para cambiar el nombre`)
        if (!text) return m.reply(`❌ Falta el nombre\nEjemplo: ${usedPrefix}gpname Nombre del Grupo`)
        if (text.length > 25) return m.reply(`❌ El nombre no puede pasar de 25 caracteres`)
        
        await conn.groupUpdateSubject(m.chat, text)
        return m.reply(`✅ Nombre actualizado\n\nNuevo nombre: ${text}`)
    }

}

handler.help = ['gpdesc', 'gpname']
handler.tags = ['group']
handler.command = /^(gpdesc|gpname)$/i
handler.group = true
handler.admin = true
export default handler