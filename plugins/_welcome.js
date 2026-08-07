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
    let realJid = who.replace('@lid', '@s.whatsapp.net')

    let metadata = await this.groupMetadata(m.chat).catch(() => {})
    if (!metadata) return

    let user = '@' + realJid.split('@')[0]
    let groupName = metadata.subject
    let total = metadata.participants.length

    let sWelcome = chat.sWelcome || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó a @group!*\n\n🍓 *Usuario:* @user\n🍓 *Somos:* @count`
    let sBye = chat.sBye || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita de @group*\n\n🍓 *Usuario:* @user\n🍓 *Quedamos:* @count`

    // ===== TRUCO: SACAR FOTO DIRECTO DE METADATA =====
    let imgBuffer
    try {
        // En Baileys v5 metadata a veces trae icon o pp
        let ppUrl = metadata.icon || metadata.image || await this.profilePictureUrl(m.chat, 'image')

        let { data } = await axios.get(ppUrl, {
            responseType: 'arraybuffer',
            timeout: 10000,
            headers: {'User-Agent': 'Mozilla/5.0'} // para que no bloquee
        })
        imgBuffer = Buffer.from(data)
        console.log('Foto del grupo descargada')
    } catch (e) {
        console.log('Error foto grupo:', e.message)
        // Fallback
        let { data } = await axios.get('https://files.evogb.win/wt9HaN.jpg', { responseType: 'arraybuffer' })
        imgBuffer = Buffer.from(data)
    }

    let txt = ''
    if (m.messageStubType === 27 && chat.welcome) txt = sWelcome.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@count/g, total)
    if ((m.messageStubType === 28 || m.messageStubType === 32) && chat.bye) txt = sBye.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@count/g, total)
    if (!txt) return

    await this.sendMessage(m.chat, { image: imgBuffer, caption: txt, mentions: [realJid] })

    let audioPath = path.join('./media', `${m.messageStubType === 27? 'welcome' : 'bye'}_${m.chat}.mp3`)
    if (fs.existsSync(audioPath)) {
        await this.sendMessage(m.chat, { audio: fs.readFileSync(audioPath), mimetype: 'audio/mpeg' })
    }
}
export default handler