import fs from 'fs'
import path from 'path'

let handler = m => m
handler.all = async function (m) {
    if (!m.messageStubType ||!m.isGroup) return
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]

    if (chat.welcome == null) chat.welcome = true
    if (chat.bye == null) chat.bye = true

    if (!chat.sWelcome) chat.sWelcome = `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count miembritos\n"Bienvenid@ a la canasta fresita 💕"`
    if (!chat.sBye) chat.sBye = `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count miembritos\n"Nos vemos prontito 💫"`

    let who = m.messageStubParameters?.[0]
    if (!who) return

    // CONVERTIR LID A JID
    let jid = who
    if (who.endsWith('@lid')) jid = who.replace('@lid', '@s.whatsapp.net')

    let metadata = await this.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return
    let groupName = metadata.subject
    let total = metadata.participants.length

    // FOTO CON METODO NATIVO DE BAILEYS
    let img
    try {
        img = await this.profilePictureUrl(jid, 'image').catch(() => null)
        if (img) {
            img = await this.getFile(img) // descarga y convierte a buffer
            img = img.data
        } else {
            throw new Error('No tiene foto')
        }
    } catch {
        img = { url: 'https://i.imgur.com/2yZ8WbF.jpg' } // default fresita
    }

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

    await this.sendMessage(m.chat, {
        image: img,
        caption: txt,
        mentions: [jid] // MENCION IMPORTANTE
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