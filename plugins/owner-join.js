import { getBotConfig } from '../lib/botconfig.js'

let linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

let handler = async (m, { conn, text, isOwner }) => {
  const botname = getBotConfig(conn, 'botname')

    if (!text) return m.reply(`🍓 *AY NOOO* 🍓

╭─「 *INSTRUCCION* 」─╮
│ *Debes enviar una invitacion para que*
│ *${botname}* *se una al grupo*
╰─────────────

> *Ejemplo* : .join https://chat.whatsapp.com/xxxxx`);

    let [_, code] = text.match(linkRegex) || [];

    if (!code) return m.reply(`❌ *ERROR* ❌

╭─「 *VALIDACION* 」─╮
│ *Enlace de invitacion no valido*
╰─────────────`);

    if (isOwner) {
        await conn.groupAcceptInvite(code)
            .then(res => m.reply(`🍓 *ACCESO CONCEDIDO* 🍓

╭─「 *REPORTE* 」─╮
│ *Me he unido exitosamente al grupo*
╰─────────────

> *Hola fresitas* 😘`))
            .catch(err => m.reply(`❌ *ERROR CRITICO* ❌

╭─「 *DETALLE* 」─╮
│ *Error al unirme al grupo*
╰─────────────

> *Verifica que el link sea valido* 😿`));
    } else {
        let message = `🍓 *SOLICITUD DE INGRESO* 🍓

╭─「 *DETALLE* 」─╮
│ *ENLACE* : ${text}
│ *POR* : @${m.sender.split('@')[0]}
╰─────────────

> *El owner debe aprobar* 👑`;
        await conn.sendMessage(`${suittag}` + '@s.whatsapp.net', { text: message, mentions: [m.sender] }, { quoted: m });
        m.reply(`🍓 *SOLICITUD ENVIADA* 🍓

╭─「 *ESTADO* 」─╮
│ *El link del grupo ha sido enviado al owner*
╰─────────────

> *Espera a que lo apruebe* ✨`, null, { mentions: [m.sender] });
    }
};

handler.help = ['invite'];
handler.tags = ['owner'];
handler.command = ['invite', 'join'];

export default handler;