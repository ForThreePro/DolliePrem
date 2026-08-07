import fs from 'fs'
import path from 'path'
import axios from 'axios'

let handler = m => m
handler.all = async function (m) {
    if (!m.messageStubType ||!m.isGroup) return

    let chat = global.db.data.chats[m.chat] || {}
    chat.welcome??= true
    chat.bye??= true

    let who = m.messageStubParameters?.[0]
    if (!who) return

    // NUCLEAR: Buscar el jid real en participants
    let metadata = await this.groupMetadata(m.chat).catch(() => {})
    if (!metadata) return

    let participant = metadata.participants.find(p => p.id === who || p.id.includes(who.split('@')[0]))
    let realJid = participant?.id || who.replace('@lid', '@s.whatsapp.net')
    let userNum = realJid.split('@')[0]

    let groupName = metadata.subject
    let total = metadata.participants.length

    // FOTO DEL USUARIO - PRIORIDAD
    let imgBuffer
    try {
        let ppUrl = await this.profilePictureUrl(realJid, 'image').catch(() => null)
        let { data } = await axios.get(ppUrl || 'https://files.evogb.win/wt9HaN.jpg', { responseType: 'arraybuffer' })
        imgBuffer = Buffer.from(data)
    } catch {
        let { data } = await axios.get('https://files.evogb.win/wt9HaN.jpg', { responseType: 'arraybuffer' })
        imgBuffer = Buffer.from(data)
    }

    let sWelcome = chat.sWelcome || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó a ${groupName}!*\n\n🍓 *Usuario:* @${userNum}\n🍓 *Somos:* ${total} miembritos\n\n"Bienvenid@ a la canasta fresita 💕"`
    let sBye = chat.sBye || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita de ${groupName}*\n\n🍓 *Usuario:* @${userNum}\n🍓 *Quedamos:* ${total} miembritos\n"Nos vemos prontito 💫"`

    let txt = ''
    let audioPath = ''

    if (m.messageStubType === 27 && chat.welcome) {
        txt = sWelcome
        audioPath = path.join('./media', `welcome_${m.chat}.mp3`)
    }
    if ((m.messageStubType === 28 || m.messageStubType === 32) && chat.bye) {
        txt = sBye
        audioPath = path.join('./media', `bye_${m.chat}.mp3`)
    }
    if (!txt) return

    // ENVIAR CON 2 FORMAS DE MENCION - LA QUE ME DISTE
    await this.sendMessage(m.chat, {
        image: imgBuffer,
        caption: txt,
        mentions: [realJid], // forma 1
        contextInfo: {
            mentionedJid: [realJid] // forma 2
        }
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