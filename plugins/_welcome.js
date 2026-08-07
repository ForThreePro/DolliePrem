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

    // CONVERTIR @lid A JID REAL
    let realJid = who
    if (who.endsWith('@lid')) {
        try {
            let res = await this.onWhatsApp(who)
            realJid = res[0]?.jid || who.replace('@lid', '@s.whatsapp.net')
        } catch {
            realJid = who.replace('@lid', '@s.whatsapp.net')
        }
    }

    let metadata = await this.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return
    let user = '@' + realJid.split('@')[0]
    let groupName = metadata.subject
    let total = metadata.participants.length

    // FOTO DE PERFIL
    let img
    try {
        let pp = await this.profilePictureUrl(realJid, 'image')
        img = await fetch(pp).then(v => v.buffer())
    } catch {
        img = { url: 'https://files.evogb.win/wt9HaN.jpg' }
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
    let defaultAudio = ''

    // ===== ENTRADA =====
    if (m.messageStubType === 27) {
        if (chat.welcome === false) return
        txt = replace(chat.sWelcome)
        audioPath = path.join('./media', `welcome_${m.chat}.mp3`) // audio personalizado
        defaultAudio = path.join(process.cwd(), 'bienvenida.mp3') // audio por defecto raíz
    }

    // ===== SALIDA =====
    if (m.messageStubType === 28 || m.messageStubType === 32) {
        if (chat.bye === false) return
        txt = replace(chat.sBye)
        audioPath = path.join('./media', `bye_${m.chat}.mp3`) // audio personalizado
        defaultAudio = path.join(process.cwd(), 'despedida.mp3') // audio por defecto raíz
    }

    if (!txt) return

    // MANDAR IMAGEN + TEXTO
    await this.sendMessage(m.chat, {
        image: img,
        caption: txt,
        mentions: [realJid]
    })

    // LOGICA DE AUDIO: 1ro busca el del grupo, si no hay usa el de la raíz
    let audioToSend = null
    if (fs.existsSync(audioPath)) {
        audioToSend = fs.readFileSync(audioPath)
    } else if (fs.existsSync(defaultAudio)) {
        audioToSend = fs.readFileSync(defaultAudio)
    }

    if (audioToSend) {
        setTimeout(async () => {
            await this.sendMessage(m.chat, {
                audio: audioToSend,
                mimetype: 'audio/mpeg',
                ptt: false
            })
        }, 1500)
    }
}

export default handler