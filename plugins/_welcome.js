import fs from 'fs'
import path from 'path'
import axios from 'axios'

let handler = m => m
handler.all = async function (m) {
    if (!m.messageStubType ||!m.isGroup) return
    let chat = global.db.data.chats[m.chat] || {}
    if (chat.welcome == null) chat.welcome = true
    if (chat.bye == null) chat.bye = true

    let who = m.messageStubParameters?.[0]
    if (!who) return
    let realJid = who.endsWith('@lid')? who.replace('@lid', '@s.whatsapp.net') : who

    let metadata = await this.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return
    let user = '@' + realJid.split('@')[0]
    let groupName = metadata.subject
    let total = metadata.participants.length

    let sWelcome = chat.sWelcome || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count`
    let sBye = chat.sBye || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count`

    // 1. DETECTAR FOTO DEL USUARIO
    let imgBuffer = null
    try {
        // 'image' = calidad alta, 'preview' = miniatura
        let ppUrl = await this.profilePictureUrl(realJid, 'image').catch(() => null)
        if (ppUrl) {
            let res = await axios.get(ppUrl, {
                responseType: 'arraybuffer',
                timeout: 5000 // por si tarda
            })
            imgBuffer = Buffer.from(res.data)
        }
    } catch (e) {
        console.log('No se pudo obtener foto de:', realJid, e.message)
        imgBuffer = null // sin foto = usamos default
    }

    let txt = ''
    if (m.messageStubType === 27 && chat.welcome) txt = sWelcome.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@count/g, total)
    if ((m.messageStubType === 28 || m.messageStubType === 32) && chat.bye) txt = sBye.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@count/g, total)
    if (!txt) return

    // 2. ENVIAR CON FOTO DETECTADA O DEFAULT
    await this.sendMessage(m.chat, {
        image: imgBuffer || { url: 'https://files.evogb.win/wt9HaN.jpg' },
        caption: txt,
        mentions: [realJid]
    })

    // 3. AUDIO OPCIONAL
    let audioPath = path.join('./media', `${m.messageStubType === 27? 'welcome' : 'bye'}_${m.chat}.mp3`)
    if (fs.existsSync(audioPath)) {
        await this.sendMessage(m.chat, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mpeg',
            ptt: false
        })
    }
}

export default handler