import fs from 'fs'
import path from 'path'
import axios from 'axios'

let handler = m => m
handler.all = async function (m) {
    if (!m.messageStubType ||!m.isGroup) return
    let chat = global.db.data.chats[m.chat] || {}
    chat.welcome??= true
    chat.bye??= true
    chat.cacheNombres??= {}

    let who = m.messageStubParameters?.[0]
    if (!who) return

    let metadata = await this.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return

    let rawJid = who
    let realJid = rawJid.replace('@lid', '@s.whatsapp.net')
    let userNum = realJid.split('@')[0]

    // GUARDAR NOMBRE/NUMERO CUANDO ENTRA
    if (m.messageStubType === 27) {
        let p = metadata.participants.find(v => v.id.includes(userNum))
        chat.cacheNombres[userNum] = p?.name || p?.notify || userNum
    }

    let nombreCache = chat.cacheNombres[userNum] || userNum
    if (m.messageStubType!== 27) delete chat.cacheNombres[userNum]

    let groupName = metadata.subject
    let total = metadata.participants.length

    let sWelcome = chat.sWelcome || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó a @group!*\n\n🍓 *Usuario:* @user\n🍓 *Somos:* @count miembritos\n"Bienvenid@ a la canasta fresita 💕"`
    let sBye = chat.sBye || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita de @group*\n\n🍓 *Se fue:* @user\n🍓 *Quedamos:* @count miembritos\n"Te vamos a extrañar 🍓"`

    // REPLACE DIFERENTE
    const replaceWelcome = (txt) => txt.replace(/@user/g, `@${nombreCache}`).replace(/@group/g, groupName).replace(/@count/g, total)
    const replaceBye = (txt) => txt.replace(/@user/g, `${nombreCache}`).replace(/@group/g, groupName).replace(/@count/g, total)

    // FOTO GRUPO
    let imgBuffer
    try {
        let ppUrl = await this.profilePictureUrl(m.chat, 'image')
        let { data } = await axios.get(ppUrl, { responseType: 'arraybuffer' })
        imgBuffer = Buffer.from(data)
    } catch {
        let { data } = await axios.get('https://files.evogb.win/wt9HaN.jpg', { responseType: 'arraybuffer' })
        imgBuffer = Buffer.from(data)
    }

    let txt = ''
    let mentions = []

    if (m.messageStubType === 27 && chat.welcome) {
        txt = replaceWelcome(sWelcome)
        mentions = [realJid] // WELCOME SI MENCIONA
    }
    if ((m.messageStubType === 28 || m.messageStubType === 32) && chat.bye) {
        txt = replaceBye(sBye)
        mentions = [] // BYE NO MENCIONA PARA EVITAR +9786
    }
    if (!txt) return

    await this.sendMessage(m.chat, {
        image: imgBuffer,
        caption: txt,
        mentions: mentions,
        contextInfo: { mentionedJid: mentions }
    })

    let audioPath = path.join('./media', `${m.messageStubType === 27? 'welcome' : 'bye'}_${m.chat}.mp3`)
    if (fs.existsSync(audioPath)) {
        await this.sendMessage(m.chat, { audio: fs.readFileSync(audioPath), mimetype: 'audio/mpeg', ptt: false })
    }
}
export default handler