import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

export async function before(m, { conn }) {
    if (!m.messageStubType ||!m.isGroup) return true
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]

    if (chat.welcome == null) chat.welcome = true
    if (chat.bye == null) chat.bye = true

    let who = m.messageStubParameters?.[0]
    if (!who) return true

    // FIX IMPORTANTE PARA @lid
    let realJid = who
    if (who.endsWith('@lid')) {
        try {
            let res = await conn.onWhatsApp(who)
            realJid = res[0]?.jid || who.replace('@lid', '@s.whatsapp.net')
        } catch {
            realJid = who.replace('@lid', '@s.whatsapp.net')
        }
    }

    let metadata = await conn.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return true
    let user = '@' + realJid.split('@')[0]

    // FOTO
    let img
    try {
        let pp = await conn.profilePictureUrl(realJid, 'image')
        img = await fetch(pp).then(v => v.buffer())
    } catch {
        img = { url: 'https://files.evogb.win/wt9HaN.jpg' }
    }

    let txt = ''
    let audio = ''

    // WELCOME 27 = ADD
    if (m.messageStubType === 27 || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        if (chat.welcome === false) return true
        audio = 'bienvenida.mp3'
        txt = `╭─🎀─❒ *『 𝗗𝗢𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮
│
│ ✨ *¡Nuevo miembrito llegó!*
│
│ 🎀 *Usuario:* ${user}
│ 💫 *Grupo:* ${metadata.subject}
│ ⭐ *Total:* ${metadata.participants.length} miembritos
│
│ "Bienvenido a la familia 🎀
│ Ponte cómodo y disfruta 💫"
│
│ > *Dollie dice: Nuevo angelito en el grupo*
╰─────────────────────────╯`
    }

    // BYE 28 = LEAVE, 32 = REMOVE
    if (m.messageStubType === 28 || m.messageStubType === 32 || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
        if (chat.bye === false) return true
        audio = 'despedida.mp3'
        txt = `╭─🎀─❒ *『 𝗗𝗢𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🎀─╮
│
│ 💫 *Se fue un miembrito*
│
│ 🎀 *Usuario:* ${user}
│ ✨ *Grupo:* ${metadata.subject}
│ ⭐ *Quedamos:* ${metadata.participants.length} miembritos
│
│ "Nos vemos prontito 💫"
│
│ > *Dollie dice: Te vamos a extrañar* 🎀
╰─────────────────────────╯`
    }

    if (!txt) return true

    await conn.sendMessage(m.chat, {
        image: img,
        caption: txt,
        mentions: [realJid] // MENCIONAR CON EL JID REAL
    })

    // AUDIO
    let audioPath = path.join(process.cwd(), audio)
    if (fs.existsSync(audioPath)) {
        setTimeout(async () => {
            await conn.sendMessage(m.chat, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mpeg',
                ptt: false
            })
        }, 1500)
    }
    return false // TAPA OTROS WELCOME
}

export default async function handler(){}