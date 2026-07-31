import { WAMessageStubType } from '@whiskeysockets/baileys';

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType ||!m.isGroup) return true;

    const chat = global.db.data.chats[m.chat];
    if (!chat.welcome) return true;

    const target = m.messageStubParameters?.[0];
    if (!target) return true;

    const userData = global.db.data.users[target] || {};
    const targetName = userData.name || await conn.getName(target) || `@${target.split('@')[0]}`;

    const actor = m.participant || m.key.participant || m.messageStubParameters?.[1] || null;

    let memberCount = participants.length;
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) memberCount++;
    if ([WAMessageStubType.GROUP_PARTICIPANT_REMOVE, WAMessageStubType.GROUP_PARTICIPANT_LEAVE].includes(m.messageStubType)) memberCount--;

    const actionText = {
        [WAMessageStubType.GROUP_PARTICIPANT_ADD]:
            actor? `*Reclutado por* @${actor.split('@')[0]}` : '*Ingresó solita*',

        [WAMessageStubType.GROUP_PARTICIPANT_REMOVE]:
            actor? `*Eliminado por* @${actor.split('@')[0]}` : '*Expulsado del grupo*',

        [WAMessageStubType.GROUP_PARTICIPANT_LEAVE]:
            '*Se fue del grupo*'
    };

    const format = (text) => {
        return text
       .replace('@user', `@${target.split('@')[0]}`)
       .replace('@name', targetName)
       .replace('@group', groupMetadata.subject)
       .replace('@desc', groupMetadata.desc?.toString() || 'Sin descripcion')
       .replace('%users', memberCount)
       .replace('@action', actionText[m.messageStubType] || '')
       .replace('@date', new Date().toLocaleString('es-PE'));
    };

    // DETECTAR SI TIENE FOTO O NO
    let ppUrl;
    try {
        ppUrl = await conn.profilePictureUrl(target, 'image');
    } catch {
        // Si no tiene foto, usa tu banner fresita
        ppUrl = 'https://files.evogb.win/qLamZD.jpg'
    }

    const welcome = format(`
╭───「 🍓 *BIENVENIDA FRESA* 」───╮
│
│ *NOMBRE* : @name
│ *GRUPO* : @group
│
│ *ESTADO* : @action
│
├─「 *INFO DEL GRUPO* 」─
│ 📜 *DESC* : @desc
│ 👥 *MIEMBROS* : %users
│ ⚠️ *RECUERDA* : Lee las reglas y portate bien
╰─────────────

> *Bienvenida fresita nueva* 😘 No hagas travesuras
`.trim());

    const bye = format(`
╭───「 🍓 *DESPEDIDA* 」───╮
│
│ *NOMBRE* : @name
│ *GRUPO* : @group
│
│ *ESTADO* : @action
│
├─「 *REPORTE* 」─
│ 👥 *MIEMBROS ACTUALES* : %users
│ 🕐 *SALIDA* : @date
╰─────────────

> *Se nos fue una fresita* 😿 Pero aquí seguimos
`.trim());

    const mentions = [target];
    if (actor) mentions.push(actor);

    const context = {
        contextInfo: {
            mentionedJid: mentions,
            isForwarded: true
        }
    };

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        await conn.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: welcome,
       ...context
        });
    }

    if ([WAMessageStubType.GROUP_PARTICIPANT_LEAVE, WAMessageStubType.GROUP_PARTICIPANT_REMOVE].includes(m.messageStubType)) {
        await conn.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: bye,
       ...context
        });
    }
}