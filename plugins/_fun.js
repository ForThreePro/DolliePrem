let handler = async (m, { conn, command, text }) => {
    if(!m.isGroup) return m.reply('🍓 *Fresita Bot* solo funciona en grupos')

    let metadata = await conn.groupMetadata(m.chat)
    let users = metadata.participants.map(u => u.id)
    let porcentaje = Math.floor(Math.random() * 101)

    const BOX_TOP = `╭───「 🍓 *FRESITA SYSTEM* 」───╮`
    const BOX_BOT = `╰─────────────`

    const frasesDuo = ["Somos el duo perfecto 😎","Juntos somos un peligro ⚠️","El duo que rompe grupos 💥","Duo de chisme nivel dios ☕","Dinamita pura 🧨","El mejor duo del server 👑"]
    const frasesBro = ['"Oe mano pásame 5 soles"','"Ya pe no seas malo"','"Después te pago juro"','"Invítame una gaseosa"']
    const frasesPerro = ['Te dice "amor" y a 3 más también','Huele a cuernos','Te deja en visto','Sube historias sin ti']

    // RANDOM SIN REPETIR
    function getRandomUsers(cantidad) {
        let shuffled = [...users].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, cantidad)
    }

    function jidToTag(jid) {
        return '@' + jid.split('@')[0]
    }

    function findUserByName(name) {
        name = name.toLowerCase().replace('@','')
        return users.find(u => {
            let num = u.split('@')[0].toLowerCase()
            return num.includes(name)
        })
    }

    let txt = ''
    let mentions = []

    // SOLO PARA COMANDOS DE 1 PERSONA
    let target = m.mentionedJid[0] || m.quoted?.sender
    if(!target && text &&!['2p2','3p3','duo'].includes(command.toLowerCase())) {
        let possibleName = text.split(' ')[0]
        target = findUserByName(possibleName)
    }

    if(!target &&!['2p2','3p3','duo'].includes(command.toLowerCase()))
        return m.reply(`╭───「 ⚠️ *USO INCORRECTO* 」───╮
│
│ *USO* :.${command} @tag
│ *EJEMPLO* :.${command} @Juan
│ *ALT* : Responde +.${command}
│
╰─────────────
> *Mencióname a alguien fresita* 🍓`)

    let cmd = command.toLowerCase().replace(' ','') // quita espacios

    switch(cmd) {
        // ========== FLIRT ==========
        case 'miamor':
            mentions = [target]
            txt = `${BOX_TOP}
│ *MODULO* : Amor Detectado
│
│ *TARGET* : ${jidToTag(target)}
│ *NIVEL* : ${porcentaje}%
│ *DIAGNOSTICO* : ${porcentaje > 70? 'Almas Gemelas' : porcentaje > 40? 'Hay Quimica' : 'Frio Como Hielo'}
${BOX_BOT}
> *El amor está en el aire* 😘`
            break

        case 'mibebito':
            mentions = [target]
            txt = `${BOX_TOP}
│ *MODULO* : Fiu Fiu Detectado
│
│ *TARGET* : ${jidToTag(target)} 😏
│ *NIVEL* : ${porcentaje}%
${BOX_BOT}
> *Uy uy que coqueto* 🍓`
            break

        case 'bratz':
            mentions = [target]
            txt = `${BOX_TOP}
│ *MODULO* : Bratz Detectada
│
│ *TARGET* : ${jidToTag(target)}
│ *NIVEL* : ${porcentaje}%
${BOX_BOT}
> *Pura actitud de fresita* 💅`
            break

        case 'bellaka':
            mentions = [target]
            txt = `${BOX_TOP}
│ *MODULO* : Bellaka Detectada
│
│ *TARGET* : ${jidToTag(target)}
│ *PEREO* : ${porcentaje}%
${BOX_BOT}
> *Peligrosa esa* 😈`
            break

        // ========== TROLO ==========
        case 'brother':
            mentions = [target]
            txt = `${BOX_TOP}
│ *MODULO* : Frase Pitufo
│
│ *TARGET* : ${jidToTag(target)}
│ *FRASE* : ${frasesBro[Math.floor(Math.random()*4)]}
${BOX_BOT}`
            break

        case 'perroinfiel':
            mentions = [target]
            txt = `${BOX_TOP}
│ *MODULO* : Perro Infiel
│
│ *TARGET* : ${jidToTag(target)}
│ *EVIDENCIA* : ${frasesPerro[Math.floor(Math.random()*4)]}
│ *NIVEL* : ${porcentaje}%
${BOX_BOT}
> *Te caché* 🐶`
            break

        case 'mentiroso': case 'mentiras':
            mentions = [target]
            txt = `${BOX_TOP}
│ *MODULO* : Mentiroso Detectado
│
│ *TARGET* : ${jidToTag(target)}
│ *FRASE* : "Te lo juro por mi mama"
│ *NIVEL* : ${porcentaje}%
${BOX_BOT}
> *Ya te conozco* 🙄`
            break

        // ========== GRUPALES RANDOM ==========
        case '2p2': // 4 PERSONAS = 2 PAREJAS
            if(users.length < 4) return m.reply('🍓 Mínimo 4 personas en el grupo')
            let cuatro = getRandomUsers(4)
            mentions = cuatro
            txt = `${BOX_TOP}
│ *MODULO* : Sistema 2P2
│
│ *PAREJA 1* : ${jidToTag(cuatro[0])} ❤️ ${jidToTag(cuatro[1])}
│ *PAREJA 2* : ${jidToTag(cuatro[2])} ❤️ ${jidToTag(cuatro[3])}
│
│ *COMPATIBILIDAD* : ${porcentaje}%
${BOX_BOT}
> *Cupido fresita trabajando* 💘`
            break

        case '3p3': // 6 PERSONAS = 3 PAREJAS
            if(users.length < 6) return m.reply('🍓 Mínimo 6 personas en el grupo')
            let seis = getRandomUsers(6)
            mentions = seis
            txt = `${BOX_TOP}
│ *MODULO* : Sistema 3P3
│
│ *PAREJA 1* : ${jidToTag(seis[0])} ❤️ ${jidToTag(seis[1])}
│ *PAREJA 2* : ${jidToTag(seis[2])} ❤️ ${jidToTag(seis[3])}
│ *PAREJA 3* : ${jidToTag(seis[4])} ❤️ ${jidToTag(seis[5])}
│
│ *COMPATIBILIDAD* : ${porcentaje}%
${BOX_BOT}
> *Match para todos* 😘`
            break

        case 'duo': // 2 PERSONAS = 1 PAREJA
            if(users.length < 2) return m.reply('🍓 Mínimo 2 personas en el grupo')
            let dos = getRandomUsers(2)
            mentions = dos
            let frase = frasesDuo[Math.floor(Math.random() * frasesDuo.length)]
            txt = `${BOX_TOP}
│ *MODULO* : Duo Random
│
│ *USUARIO 1* : ${jidToTag(dos[0])}
│ *USUARIO 2* : ${jidToTag(dos[1])}
│
│ *RESULTADO* : ${frase}
│ *COMPATIBILIDAD* : ${porcentaje}%
${BOX_BOT}`
            break

        default:
            return
    }

    if(txt) await conn.sendMessage(m.chat, {
        text: txt,
        mentions: mentions // SOLO ETIQUETA A LOS QUE SALIERON
    }, { quoted: m })
}

handler.help = ['miamor','mibebito','bratz','bellaka','brother','perroinfiel','mentiroso','2p2','3p3','duo']
handler.tags = ['joda']
handler.command = /^(miamor|mi amor|mibebito|bratz|bellaka|brother|perroinfiel|perro infiel|mentiroso|mentiras|2p2|3p3|duo)$/i
handler.group = true
export default handler