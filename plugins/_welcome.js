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

    // 1. BUSCAR NOMBRE EN PARTICIPANTS
    let p = metadata.participants.find(v => v.id.includes(userNum))
    let nombre = p?.name || p?.notify || p?.short || userNum

    // 2. SI NO ESTA, BUSCAR EN CACHE
    if (!p && chat.cacheNombres[userNum]) {
        nombre = chat.cacheNombres[userNum]
    }

    // 3. SI NO ESTA EN CACHE, FORZAR CON GETCONTACT
    if (!p &&!chat.cacheNombres[userNum]) {
        try {
            let contact = await this.getContact(realJid)
            nombre = contact?.name || contact?.notify || userNum
        } catch {}
    }

    // GUARDAR EN CACHE CUANDO ENTRA
    if (m.messageStubType === 27) {
        chat.cacheNombres[userNum] = nombre
    }
    if (m.messageStubType!== 27) delete chat.cacheNombres[userNum]

    let groupName = metadata.subject
    let total = metadata.participants.length

    let sWelcome = chat.sWelcome || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count`
    let sBye = chat.sBye || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count`

    const replace = (txt) => txt.replace(/@user/g, `@${nombre}`).replace(/@group/g, groupName).replace(/@count/g, total)

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

    // FORZAR MENCION SIEMPRE
    await this.sendMessage(m.chat, {
        image: imgBuffer,
        caption: txt,
        mentions: [realJid], // SIEMPRE MENCIONA
        contextInfo: {
            mentionedJid: [realJid],
            forwardingScore: 999,
            isForwarded: true
        }
    })

    let audioPath = path.join('./media', `${m.messageStubType === 27? 'welcome' : 'bye'}_${m.chat}.mp3`)
    if (fs.existsSync(audioPath)) {
        await this.sendMessage(m.chat, { audio: fs.readFileSync(audioPath), mimetype: 'audio/mpeg', ptt: false })
    }
}
export default handler