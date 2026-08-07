import fs from 'fs'
import path from 'path'
import axios from 'axios'

let handler = m => m
handler.all = async function (m) {
    if (!m.messageStubType ||!m.isGroup) return

    let chat = global.db.data.chats[m.chat] || {}
    chat.welcome??= true
    chat.bye??= true

    if (!chat.sWelcome) chat.sWelcome = `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count miembritos\n"Bienvenid@ a la canasta fresita 💕\nPonte cómodo y disfruta"\n\n> *Fresita dice: Nuevo angelito en el grupo*`
    if (!chat.sBye) chat.sBye = `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count miembritos\n"Nos vemos prontito 💫"\n\n> *Fresita dice: Te vamos a extrañar* 🍓`

    let who = m.messageStubParameters?.[0]
    if (!who) return

    // BUSCAR JID REAL
    let metadata = await this.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return
    let participant = metadata.participants.find(p => p.id === who || p.id.includes(who.split('@')[0]))
    let realJid = participant?.id || who.replace('@lid', '@s.whatsapp.net')
    let userNum = realJid.split('@')[0]

    let groupName = metadata.subject
    let total = metadata.participants.length

    // REEMPLAZAR VARIABLES @user @group @count
    const replace = (txt) => txt
       .replace(/@user/g, `@${userNum}`)
       .replace(/@group/g, groupName)
       .replace(/@count/g, total)

    // FOTO DEL USUARIO
    let imgBuffer
    try {
        let ppUrl = await this.profilePictureUrl(realJid, 'image')
        let { data } = await axios.get(ppUrl, { responseType: 'arraybuffer', timeout: 5000 })
        imgBuffer = Buffer.from(data)
    } catch {
        let { data } = await axios.get('https://files.evogb.win/wt9HaN.jpg', { responseType: 'arraybuffer' })
        imgBuffer = Buffer.from(data)
    }

    let txt = ''
    let audioPath = ''

    if (m.messageStubType === 27 && chat.welcome) {
        txt = replace(chat.sWelcome) // AQUI SE REEMPLAZA
        audioPath = path.join('./media', `welcome_${m.chat}.mp3`)
    }
    if ((m.messageStubType === 28 || m.messageStubType === 32) && chat.bye) {
        txt = replace(chat.sBye) // AQUI SE REEMPLAZA
        audioPath = path.join('./media', `bye_${m.chat}.mp3`)
    }
    if (!txt) return

    // ENVIAR CON DOBLE MENCION
    await this.sendMessage(m.chat, {
        image: imgBuffer,
        caption: txt,
        mentions: [realJid],
        contextInfo: { mentionedJid: [realJid] }
    })

    if (fs.existsSync(audioPath)) {
        await this.sendMessage(m.chat, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mpeg',
            ptt: false
        })
    }
}
export default handler