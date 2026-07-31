import { WAMessageStubType } from '@whiskeysockets/baileys';

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType ||!m.isGroup) return true;

    // FORZAR QUE EXISTA LA CONFIG
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
    let chat = global.db.data.chats[m.chat]

    // Si no existe, lo creamos en true
    if (chat.welcome == null) chat.welcome = true
    if (chat.bye == null) chat.bye = true

    const target = m.messageStubParameters?.[0];
    if (!target) return true;

    const userData = global.db.data.users[target] || {};
    const targetName = userData.name || await conn.getName(target) || `@${target.split('@')[0]}`;
    const actor = m.participant || m.key.participant || m.messageStubParameters?.[1] || null;

    let memberCount = participants.length;
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) memberCount++;
    if ([WAMessageStubType.GROUP_PARTICIPANT_REMOVE, WAMessageStubType.GROUP_PARTICIPANT_LEAVE].includes(m.messageStubType)) memberCount--;

    const actionText = {
        [WAMessageStubType.GROUP_PARTICIPANT_ADD]: actor? `*Reclutada por* @${actor.split('@')[0]}` : '*Ingresó solita*',
        [WAMessageStubType.GROUP_PARTICIPANT_REMOVE]: actor? `*Eliminada por* @${actor.split('@')[0]}` : '*Expulsada del grupo*',
        [WAMessageStubType.GROUP_PARTICIPANT_LEAVE]: '*Se fue del grupo*'
    };

    const format = (text) => text
    .replace('@user', `@${target.split('@')[0]}`)
    .replace('@name', targetName)
    .replace('@group', groupMetadata.subject)
    .replace('@desc', groupMetadata.desc?.toString() || 'Sin descripcion')
    .replace('%users', memberCount)
    .replace('@action', actionText[m.messageStubType] || '')
    .replace('@date', new Date().toLocaleString('es-PE'));

    let ppUrl;
    try { ppUrl = await conn.profilePictureUrl(target, 'image'); }
    catch { ppUrl = 'https://files.evogb.win/7MjPua.jpg' }

    const welcome = format(`
💖 *BIENVENIDA DULZURA* 💖
╭─「 *BIENVENIDA* 」─╮
│ *NOMBRE* : @name
│ *GRUPO* : @group
│ *ESTADO* : @action
╰─────────────
├─「 *INFO DEL GRUPO* 」─
│ 📜 *DESC* : @desc
│ 👥 *MIEMBROS* : %users
│ ⚠️ *RECUERDA* : Lee las reglas y portate bien dulzura
╰─────────────
> *Bienvenida a casa* 😘 No hagas travesuras 🌸`.trim());

    const bye = format(`
💖 *DESPEDIDA* 💖
╭─「 *REPORTE* 」─╮
│ *NOMBRE* : @name
│ *GRUPO* : @group
│ *ESTADO* : @action
╰─────────────
├─「 *DETALLE* 」─
│ 👥 *MIEMBROS ACTUALES* : %users
│ 🕐 *SALIDA* : @date
╰─────────────
> *Se nos fue una dulzura* 😿 Pero aquí seguimos esperándote 🌷`.trim());

    const mentions = [target];
    if (actor) mentions.push(actor);
    const context = { contextInfo: { mentionedJid: mentions } };

    // LA CLAVE: SOLO MANDAR SI TU TOGGLE ESTA EN TRUE
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        if (chat.welcome === false) return true // si esta off, no hagas nada
        await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: welcome,...context });
        return false // detiene otros before
    }

    if ([WAMessageStubType.GROUP_PARTICIPANT_LEAVE, WAMessageStubType.GROUP_PARTICIPANT_REMOVE].includes(m.messageStubType)) {
        if (chat.bye === false) return true // si esta off, no hagas nada
        await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: bye,...context });
        return false // detiene otros before
    }
    return true
}

// ===== COMANDOS =====
let handler = async (m, { command, args, isAdmin }) => {
    if (!isAdmin) return m.reply('❄️ *SOLO ADMINS* ❄️')
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
    let chat = global.db.data.chats[m.chat]

    if (chat.welcome == null) chat.welcome = true
    if (chat.bye == null) chat.bye = true

    const estado = args[0]?.toLowerCase() === 'on'

    if (command === 'bienvenida') {
        if (!args[0]) return m.reply(`*Estado:* ${chat.welcome? '✅ ON' : '❌ OFF'}\n*Uso:*.bienvenida on/off`)
        chat.welcome = estado
        return m.reply(`✅ *BIENVENIDA* ${chat.welcome? 'ACTIVADA' : 'DESACTIVADA'}`)
    }
    if (command === 'despedida') {
        if (!args[0]) return m.reply(`*Estado:* ${chat.bye? '✅ ON' : '❌ OFF'}\n*Uso:*.despedida on/off`)
        chat.bye = estado
        return m.reply(`✅ *DESPEDIDA* ${chat.bye? 'ACTIVADA' : 'DESACTIVADA'}`)
    }
}
handler.command = /^(bienvenida|despedida)$/i
handler.group = true
export default handler