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

    // FIX CLAVE: GUARDAR JID ANTES DE QUE LO BOTEN
    let realJid = who
    if (who.endsWith('@lid')) {
        let p = metadata.participants.find(v => v.id.includes(who.split('@')[0]))
        realJid = p?.id || who.replace('@lid', '@s.whatsapp.net')
    }

    // SI ES BYE/KICK Y YA NO ESTA EN PARTICIPANTS, USAMOS EL JID TAL CUAL
    if ((m.messageStubType === 28 || m.messageStubType === 32) &&!metadata.participants.find(p => p.id === realJid)) {
        realJid = who.replace('@lid', '@s.whatsapp.net')
    }

    let userNum = realJid.split('@')[0]
    let groupName = metadata.subject
    let total = metadata.participants.length

    let sWelcome = chat.sWelcome || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count miembritos`
    let sBye = chat.sBye || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count miembritos`

    const replace = (txt) => txt.replace(/@user/g, `@${userNum}`).replace(/@group/g, groupName).replace(/@count/g, total)

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
    let audioPath = ''

    if (m.messageStubType === 27 && chat.welcome) {
        txt = replace(sWelcome)
        audioPath = path.join('./media', `welcome_${m.chat}.mp3`)
    }
    if ((m.messageStubType === 28 || m.messageStubType === 32) && chat.bye) {
        txt = replace(sBye)
        audioPath = path.join('./media', `bye_${m.chat}.mp3`)
    }
    if (!txt) return

    await this.sendMessage(m.chat, {
        image: imgBuffer,
        caption: txt,
        mentions: [realJid], // AQUI ESTA LA MENCION
        contextInfo: { mentionedJid: [realJid] } // Y AQUI TAMBIEN
    })

    if (fs.existsSync(audioPath)) {
        await this.sendMessage(m.chat, { audio: fs.readFileSync(audioPath), mimetype: 'audio/mpeg', ptt: false })
    }
}
export default handler