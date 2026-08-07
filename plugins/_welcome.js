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

    // FIX 1: Convertir @lid y también forzar @s.whatsapp.net
    let realJid = who.replace(/@lid$/, '@s.whatsapp.net')

    let metadata = await this.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return
    let user = '@' + realJid.split('@')[0]
    let groupName = metadata.subject
    let total = metadata.participants.length

    let sWelcome = chat.sWelcome || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n✨ *¡Nueva fresita llegó!*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Total:* @count`
    let sBye = chat.sBye || `🍓━━━━━━━━━━ *FRESITA BOT* ━━━━━━━━━━🍓\n\n💫 *Se fue una fresita*\n\n🍓 *Usuario:* @user\n🍓 *Grupo:* @group\n🍓 *Quedamos:* @count`

    // FIX 2: DETECTAR FOTO CON DOBLE INTENTO
    let imgBuffer = null
    let ppUrl = null
    try {
        // Intento 1: Foto del usuario
        ppUrl = await this.profilePictureUrl(realJid, 'image')
    } catch {
        try {
            // Intento 2: A veces Baileys necesita 'preview'
            ppUrl = await this.profilePictureUrl(realJid, 'preview')
        } catch {
            // Intento 3: Foto del grupo como último recurso
            ppUrl = await this.profilePictureUrl(m.chat, 'image').catch(() => null)
        }
    }

    if (ppUrl) {
        try {
            let res = await axios.get(ppUrl, { responseType: 'arraybuffer', timeout: 7000 })
            imgBuffer = Buffer.from(res.data)
        } catch {}
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