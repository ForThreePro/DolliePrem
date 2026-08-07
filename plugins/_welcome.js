import fs from 'fs'
import path from 'path'

let handler = m => m
handler.all = async function (m) {
    if (!m.messageStubType ||!m.isGroup) return
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]

    if (chat.welcome == null) chat.welcome = true
    if (chat.bye == null) chat.bye = true

    if (!chat.sWelcome) chat.sWelcome = `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count miembritos\n"Bienvenid@ a la canasta fresita 💕\nPonte cómodo y disfruta"\n\n> *Fresita dice: Nuevo angelito en el grupo*`
    if (!chat.sBye) chat.sBye = `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count miembritos\n\n"Nos vemos prontito 💫"\n\n> *Fresita dice: Te vamos a extrañar* 🍓`

    let who = m.messageStubParameters?.[0]
    if (!who) return

    // CONVERTIR @lid A JID REAL
    let realJid = who.endsWith('@lid')? who.replace('@lid', '@s.whatsapp.net') : who

    let metadata = await this.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return
    let user = '@' + realJid.split('@')[0]
    let groupName = metadata.subject
    let total = metadata.participants.length

    // FOTO DE PERFIL - FORZAMOS BUFFER
    let img
    try {
        let pp = await this.profilePictureUrl(realJid, 'image')
        img = await this.getFile(pp)
        img = img.data // AQUI SACAMOS SOLO EL BUFFER
    } catch (e) {
        console.log('Error foto usuario:', e)
        img = { url: 'https://files.evogb.win/wt9HaN.jpg' } // default
    }

    let replace = (txt) => txt.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@count/g, total)

    let txt = ''
    let audioPath = ''

    if (m.messageStubType === 27) {
        if (chat.welcome === false) return
        txt = replace(chat.sWelcome)
        audioPath = path.join('./media', `welcome_${m.chat}.mp3`)
    }

    if (m.messageStubType === 28 || m.messageStubType === 32) {
        if (chat.bye === false) return
        txt = replace(chat.sBye)
        audioPath = path.join('./media', `bye_${m.chat}.mp3`)
    }

    if (!txt) return

    await this.sendMessage(m.chat, {
        image: img, // buffer
        caption: txt,
        mentions: [realJid]
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