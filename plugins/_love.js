let handler = async (m, { conn, command, text }) => {
  let yo = m.sender
  let who = null

  // 1. RESPONDIENDO - más seguro
  if(m.quoted) who = m.quoted.sender

  // 2. MENCION REAL - cuando tocas @ y eliges de la lista
  else if(m.mentionedJid && m.mentionedJid[0]) who = m.mentionedJid[0]

  // 3. TEXTO - cuando escribes.compatibilidad Romi2 o.compatibilidad @Romi2
  else if(text) {
    let nombreBuscado = text.replace(command, '').replace('@','').trim().toLowerCase()
    if(!nombreBuscado) return m.reply(`💕 *Uso:*.compatibilidad @usuario\n*O*.compatibilidad Romi2\n*O responde a su mensaje* 🥺`)

    let group = await conn.groupMetadata(m.chat)
    let participante = group.participants.find(p => {
      let nombre = conn.getName(p.id) || p.id.split('@')[0]
      let numero = p.id.split('@')[0]
      return nombre.toLowerCase().includes(nombreBuscado) || numero.includes(nombreBuscado)
    })
    if(participante) who = participante.id
    else return m.reply(`😿 *No encontré a "${nombreBuscado}" en el grupo*\nResponde a su mensaje o etiquétalo de la lista tocando @`)
  }

  if (!who) return m.reply(`💕 *Uso:*.compatibilidad @usuario\n*O responde a su mensaje* 🥺`)
  if (who === yo) return m.reply(`🌸 *Contigo mismo tienes 10/10 de amor propio*`)

  let compatibilidad = Math.floor(Math.random() * 10) + 1;
  let corazones = '❤️'.repeat(compatibilidad) + '🖤'.repeat(10 - compatibilidad)

  let estado, consejo
  if(compatibilidad <= 3){ estado = '🌧️ *BAJA COMPATIBILIDAD*'; consejo = 'Mejor como amigos 🥺' }
  else if(compatibilidad <= 6){ estado = '⛅ *MEDIA*'; consejo = 'Hay química, hablen más 💬' }
  else if(compatibilidad <= 9){ estado = '☀️ *ALTA*'; consejo = 'Se ven bien juntos 🤍' }
  else { estado = '🔥 *ALMAS GEMELAS*'; consejo = 'No lo suelten 💍' }

  let nameYo = await conn.getName(yo) || 'Tú'
  let nameWho = await conn.getName(who) || 'Usuario'
  let numYo = yo.split('@')[0]
  let numWho = who.split('@')[0]

  let txt = `ᯇ 💘 𝗖𝗢𝗠𝗣𝗔𝗧𝗜𝗕𝗜𝗟𝗜𝗗𝗔𝗗 𝗕𝗢𝗧 💘 ୧

꒰ ◞⁺⊹ ．@${numYo} y @${numWho}

*Puntaje:* *${compatibilidad}/10*
${corazones}

${estado}

──愛 *𝗖𝗢𝗡𝗦𝗘𝗝𝗢* ╏ 🕊️
"${consejo}"

> *El destino está en sus manos* ✨`

  await conn.sendMessage(m.chat, {
    text: txt,
    mentions: [yo, who]
  }, { quoted: m })
}

handler.help = ['love <@/responder>']
handler.tags = ['love']
handler.command = /^(love|love10)$/i
handler.group = true
export default handler