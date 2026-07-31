let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
    if (!m.isGroup) return 
    if (isAdmin || isOwner || m.fromMe || isROwner) return

    let chat = global.db.data.chats[m.chat];
    const user = `@${m.sender.split`@`[0]}`;
    const groupAdmins = participants.filter(p => p.admin);

    const isGroupLink = linkRegex.exec(m.text) || linkRegex1.exec(m.text);

    if (chat.antiLink && isGroupLink && !isAdmin) {
        // SI EL LINK ES DEL MISMO GRUPO NO HACE NADA
        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat).catch(() => "")}`;
            if (m.text.includes(linkThisGroup)) return !0;
        }

        // USA FOTO → PONEMOS DOLLIE
        await conn.sendMessage(m.chat, { 
            image: { url: 'https://files.evogb.win/7MjPua.jpg' },
            caption: `
💖 *ANTILINK ACTIVADO* 💖

╭─「 *DETECCION* 」─╮
│ *DETECTADO* : Enlace prohibido
│ *USUARIA* : ${user}
│ *ESTADO* : ⚠️ *Eliminando en 3, 2, 1...*
╰─────────────

> *Aquí no se pasan links sin permiso, dulzura* 🌸
`.trim(), 
            mentions: [m.sender] 
        }, { quoted: m });

        // USA FOTO → PONEMOS DOLLIE
        if (!isBotAdmin) {
            return conn.sendMessage(m.chat, { 
                image: { url: 'https://files.evogb.win/7MjPua.jpg' },
                caption: `
💖 *AY NOOO* 💖

╭─「 *FALTAN PERMISOS* 」─╮
│ *No puedo eliminarla* 😿
│ *Díganle a una admin que me suba de rango*
│ *Quiero cuidar el grupo bien bonito*
╰─────────────`.trim(), 
                mentions: groupAdmins.map(v => v.id) 
            }, { quoted: m });
        }

        // ELIMINAR Y KICK - NO USA FOTO
        if (isBotAdmin) {
            await conn.sendMessage(m.chat, { delete: m.key });
            await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
        }
    }
    return !0;
}