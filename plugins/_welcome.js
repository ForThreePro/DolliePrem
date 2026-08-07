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
    let realJid = who.replace('@lid', '@s.whatsapp.net') // Arreglar lid

    let metadata = await this.groupMetadata(m.chat).catch(() => {})
    if (!metadata) return

    let user = '@' + realJid.split('@')[0]
    let groupName = metadata.subject
    let total = metadata.participants.length

    let sWelcome = chat.sWelcome || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count`
    let sBye = chat.sBye || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count`

    // ===== DETECTAR Y DESCARGAR FOTO =====
    let ppUrl
    try {
        ppUrl = await this.profilePictureUrl(realJid, 'image')
    } catch {
        try {
            ppUrl = await this.profilePictureUrl(realJid, 'preview')
        } catch {
            ppUrl = 'https://files.evogb.win/wt9HaN.jpg' // default directo
        }
    }

    let imgBuffer
    try {
        let { data } = await axios.get(ppUrl, { responseType: 'arraybuffer' })
        imgBuffer = Buffer.from(data)
    } catch {
        imgBuffer = Buffer.from((await axios.get('https://files.evogb.win/wt9HaN.jpg', { responseType: 'arraybuffer' })).data)
    }

    let txt = ''
    if (m.messageStubType === 27 && chat.welcome) txt = sWelcome.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@count/g, total)
    if ((m.messageStubType === 28 || m.messageStubType === 32) && chat.bye) txt = sBye.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@count/g, total)
    if (!txt) return

    await this.sendMessage(m.chat, {
        image: imgBuffer, // Aquí ya siempre es un buffer, nunca un link
        caption: txt,
        mentions: [realJid]
    })

    let audioPath = path.join('./media', `${m.messageStubType === 27? 'welcome' : 'bye'}_${m.chat}.mp3`)
    if (fs.existsSync(audioPath)) {
        await this.sendMessage(m.chat, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mpeg'
        })
    }
}
export default handler