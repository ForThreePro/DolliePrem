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

    let metadata = await this.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return

    // FIX NUCLEAR PARA @lid - BUSCAMOS EN PARTICIPANTS
    let participant = metadata.participants.find(p => p.id === who || p.id.includes(who.replace('@lid','')))
    let realJid = participant?.id || who
    if (realJid.endsWith('@lid')) realJid = realJid.replace('@lid', '@s.whatsapp.net')

    let userNum = realJid.split('@')[0]
    let userName = participant?.name || participant?.notify || userNum // nombre si hay

    let groupName = metadata.subject
    let total = metadata.participants.length

    let sWelcome = chat.sWelcome || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count miembritos`
    let sBye = chat.sBye || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count miembritos`

    const replace = (txt) => txt
      .replace(/@user/g, `@${userNum}`)
      .replace(/@group/g, groupName)
      .replace(/@count/g, total)

    // FOTO USUARIO - CON TRY CATCH DOBLE
    let imgBuffer
    try {
        let ppUrl = await this.profilePictureUrl(realJid, 'image')
        let { data } = await axios.get(ppUrl, { responseType: 'arraybuffer' })
        imgBuffer = Buffer.from(data)
    } catch {
        try { // segundo intento por si el primero falla
            let ppUrl2 = await this.profilePictureUrl(userNum + '@s.whatsapp.net', 'image')
            let { data } = await axios.get(ppUrl2, { responseType: 'arraybuffer' })
            imgBuffer = Buffer.from(data)
        } catch {
            let { data } = await axios.get('https://files.evogb.win/wt9HaN.jpg', { responseType: 'arraybuffer' })
            imgBuffer = Buffer.from(data)
        }
    }

    let txt = ''
    if (m.messageStubType === 27 && chat.welcome) txt = replace(sWelcome)
    if ((m.messageStubType === 28 || m.messageStubType === 32) && chat.bye) txt = replace(sBye)
    if (!txt) return

    await this.sendMessage(m.chat, {
        image: imgBuffer,
        caption: txt,
        mentions: [realJid],
        contextInfo: { mentionedJid: [realJid] }
    })

    let audioPath = path.join('./media', `${m.messageStubType === 27? 'welcome' : 'bye'}_${m.chat}.mp3`)
    if (fs.existsSync(audioPath)) {
        await this.sendMessage(m.chat, { audio: fs.readFileSync(audioPath), mimetype: 'audio/mpeg', ptt: false })
    }
}
export default handler