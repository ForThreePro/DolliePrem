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

    // FIX NUCLEAR PARA @lid EN REMOVE
    let rawJid = who
    let realJid = rawJid.replace('@lid', '@s.whatsapp.net') // FORZAR CONVERSION
    let userNum = realJid.split('@')[0]

    // GUARDAR NOMBRE CUANDO ENTRA
    if (m.messageStubType === 27) {
        let p = metadata.participants.find(v => v.id.includes(userNum))
        chat.cacheNombres[userNum] = p?.name || p?.notify || userNum
    }

    let nombreCache = chat.cacheNombres[userNum] || userNum
    if (m.messageStubType!== 27) delete chat.cacheNombres[userNum]

    let groupName = metadata.subject
    let total = metadata.participants.length

    let sWelcome = chat.sWelcome || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count`
    let sBye = chat.sBye || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count`

    const replace = (txt) => txt.replace(/@user/g, `@${nombreCache}`).replace(/@group/g, groupName).replace(/@count/g, total)

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
    if (m.messageStubType === 27 && chat.welcome) txt = replace(sWelcome)
    if ((m.messageStubType === 28 || m.messageStubType === 32) && chat.bye) txt = replace(sBye)
    if (!txt) return

    // MANDAR MENSAJE CON MENCION FORZADA
    await this.sendMessage(m.chat, {
        image: imgBuffer,
        caption: txt,
        mentions: [realJid], // YA VIENE COMO @s.whatsapp.net
        contextInfo: {
            mentionedJid: [realJid],
            forwardingScore: 1,
            isForwarded: true
        }
    })

    let audioPath = path.join('./media', `${m.messageStubType === 27? 'welcome' : 'bye'}_${m.chat}.mp3`)
    if (fs.existsSync(audioPath)) {
        await this.sendMessage(m.chat, { audio: fs.readFileSync(audioPath), mimetype: 'audio/mpeg', ptt: false })
    }
}
export default handler