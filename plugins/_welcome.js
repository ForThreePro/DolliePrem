import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

let handler = m => m
handler.all = async function (m) {
    if (!m.messageStubType ||!m.isGroup) return
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]

    // ACTIVOS POR DEFECTO
    if (chat.welcome == null) chat.welcome = true
    if (chat.bye == null) chat.bye = true

    // MENSAJES POR DEFECTO FRESITA
    if (!chat.sWelcome) chat.sWelcome = `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count miembritos\n"Bienvenid@ a la canasta fresita 💕\nPonte cómodo y disfruta"\n\n> *Fresita dice: Nuevo angelito en el grupo*`
    if (!chat.sBye) chat.sBye = `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count miembritos\n\n"Nos vemos prontito 💫"\n\n> *Fresita dice: Te vamos a extrañar* 🍓`

    let who = m.messageStubParameters?.[0]
    if (!who) return

    // CONVERTIR @lid A JID REAL PARA MENCION
    let realJid = who
    if (who.endsWith('@lid')) {
        realJid = who.replace('@lid', '@s.whatsapp.net')
    }

    let metadata = await this.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return
    let user = '@' + realJid.split('@')[0]
    let groupName = metadata.subject
    let total = metadata.participants.length

    // FOTO DE PERFIL - PRIORIDAD USUARIO
    let img
    try {
        let pp = await this.profilePictureUrl(realJid, 'image')
        // DESCARGAMOS LA FOTO A BUFFER PARA QUE NO FALLE
        img = await fetch(pp, { timeout: 5000 }).then(v => v.buffer())
    } catch (e) {
        console.log('No tiene foto, usando default:', e)
        img = { url: 'https://files.evogb.win/wt9HaN.jpg' } // default si no tiene
    }

    // REEMPLAZAR VARIABLES
    let replace = (txt) => {
        return txt
      .replace(/@user/g, user)
      .replace(/@group/g, groupName)
      .replace(/@count/g, total)
    }

    let txt = ''
    let audioPath = ''

    // ===== ENTRADA =====
    if (m.messageStubType === 27) {
        if (chat.welcome === false) return
        txt = replace(chat.sWelcome)
        audioPath = path.join('./media', `welcome_${m.chat}.mp3`)
    }

    // ===== SALIDA =====
    if (m.messageStubType === 28 || m.messageStubType === 32) {
        if (chat.bye === false) return
        txt = replace(chat.sBye)
        audioPath = path.join('./media', `bye_${m.chat}.mp3`)
    }

    if (!txt) return

    // MANDAR IMAGEN + TEXTO + MENCION
    await this.sendMessage(m.chat, {
        image: img, // aqui ya va el buffer de la foto del usuario
        caption: txt,
        mentions: [realJid] // MENCION AZUL
    })

    // SOLO MANDAR AUDIO SI EL GRUPO TIENE UNO GUARDADO
    if (fs.existsSync(audioPath)) {
        setTimeout(async () => {
            await this.sendMessage(m.chat, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mpeg',
                ptt: false
            })
        }, 1500)
    }
}

export default handler