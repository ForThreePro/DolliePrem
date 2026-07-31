let handler = async (m, { conn }) => {
  try {
    const grupoID = m.chat

    await conn.groupRevokeInvite(grupoID)

    const nuevoEnlace = await conn.groupInviteCode(grupoID)
    const enlaceCompleto = 'https://chat.whatsapp.com/' + nuevoEnlace

    await conn.reply(m.sender, 
`🍓 *PROTOCOLO EJECUTADO* 🍓

╭─「 *REPORTE DE SEGURIDAD* 」─╮
│ *ENLACE ANTERIOR* : Revocado
│ *NUEVO ENLACE* : ${enlaceCompleto}
│ *ESTADO* : Sistema Seguro
╰─────────────

> *El acceso anterior ha sido anulado* 🔒 Te lo mando al privado`, 
      m, { detectLink: true })

    await conn.reply(m.chat, `🍓 *ENLACE RESTABLECIDO* 🍓

╭─「 *ADVERTENCIA* 」─╮
│ *El enlace anterior ya no funciona*
│ *Solo el nuevo enlace es valido*
╰─────────────

> *Guarden el nuevo link fresitas* 😘`, m)

  } catch (error) {
    console.error(error)
    await m.reply(`❌ *ERROR CRITICO* ❌

╭─「 *DETALLE* 」─╮
│ ${error.message}
╰─────────────

╭─「 *SOLUCION* 」─╮
│ *Verifica que el bot sea admin*
╰─────────────

> *Ay nooo algo salio mal* 😿`)
  }
}

handler.help = ['revoke']
handler.tags = ['grupo']
handler.command = ['revoke', 'restablecer']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler