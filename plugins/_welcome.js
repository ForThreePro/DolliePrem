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
    let realJid = who.replace(/@lid$/, '@s.whatsapp.net')

    let metadata = await this.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return
    let user = '@' + realJid.split('@')[0]
    let groupName = metadata.subject
    let total = metadata.participants.length

    let sWelcome = chat.sWelcome || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count`
    let sBye = chat.sBye || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count`

    // TRUCO: OBLIGAR A BAILEYS A BUSCAR LA FOTO
    let imgBuffer = null
    try {
        // 1. Primero intentamos obtener el contacto para "desbloquear" la foto
        await this.onWhatsApp(realJid).catch(() => null)

        // 2. Ahora sí pedimos la foto
        let ppUrl = await this.profilePictureUrl(realJid, 'image')
        let res = await axios.get(ppUrl, { responseType: 'arraybuffer', timeout: 8000 })
        imgBuffer = Buffer.from(res.data)
    } catch (e) {
        console.log('No se pudo foto de usuario:', e.message)
        // Si falla, usamos default
        imgBuffer = null
    }

    let txt = ''
    if (m.messageStubType === 27 && chat.welcome) txt = sWelcome.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@count/g, total)
    if ((m.messageStubType === 28 || m.messageStubType === 32) && chat.bye) txt = sBye.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@count/g, total)
    if (!txt) return

    await this.sendMessage(m.chat, {
        image: imgBuffer || { url: 'https://files.evogb.win/wt9HaN.jpg' },
        caption: txt,
        mentions: [realJid]
    })

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