import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

let handler = m => m
handler.all = async function (m) {
    if (!m.messageStubType ||!m.isGroup) return
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]

    if (chat.welcome == null) chat.welcome = true
    if (chat.bye == null) chat.bye = true

    if (!chat.sWelcome) chat.sWelcome = `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count miembritos\n"Bienvenid@ a la canasta fresita 💕"\n\n> *Fresita dice: Nuevo angelito en el grupo*`
    if (!chat.sBye) chat.sBye = `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count miembritos\n\n"Nos vemos prontito 💫"\n\n> *Fresita dice: Te vamos a extrañar* 🍓`

    let who = m.messageStubParameters?.[0]
    if (!who) return

    // 1. CONVERTIR LID A JID NORMAL PARA MENCIONAR
    let jid = who
    if (who.endsWith('@lid')) {
        let res = await this.getName(who).catch(() => {}) // esto fuerza a WA a dar el jid real
        jid = who.replace('@lid', '@s.whatsapp.net')
    }

    let metadata = await this.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return
    let name = await this.getName(jid).catch(() => 'Usuario')
    let groupName = metadata.subject
    let total = metadata.participants.length

    // 2. FOTO DEL USUARIO
    let img
    try {
        let pp = await this.profilePictureUrl(jid, 'image')
        img = { url: pp }
    } catch {
        img = { url: 'https://i.imgur.com/2yZ8WbF.jpg' } // default fresita
    }

    // 3. REEMPLAZAR @user POR EL NOMBRE + MENCION
    let txt = ''
    let audioPath = ''

    if (m.messageStubType === 27) {
        if (chat.welcome === false) return
        txt = chat.sWelcome
          .replace(/@user/g, `@${jid.split('@')[0]}`)
          .replace(/@group/g, groupName)
          .replace(/@count/g, total)
        audioPath = path.join('./media', `welcome_${m.chat}.mp3`)
    }

    if (m.messageStubType === 28 || m.messageStubType === 32) {
        if (chat.bye === false) return
        txt = chat.sBye
          .replace(/@user/g, `@${jid.split('@')[0]}`)
          .replace(/@group/g, groupName)
          .replace(/@count/g, total)
        audioPath = path.join('./media', `bye_${m.chat}.mp3`)
    }

    if (!txt) return

    // 4. LO MAS IMPORTANTE: PASAR EL JID EN MENTIONS
    await this.sendMessage(m.chat, {
        image: img,
        caption: txt,
        mentions: [jid] // AQUI ESTA EL TRUCO PARA QUE PINTE AZUL
    })

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