var handler = async (m, { conn, participants }) => {
  const groupInfo = await conn.groupMetadata(m.chat);
  const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  const ownerBot = globalThis.owner[0][0] + '@s.whatsapp.net';

  let targets = participants
 .map(p => p.id)
 .filter(id => id!== conn.user.jid)
 .filter(id => id!== ownerGroup)
 .filter(id => id!== ownerBot)
 .filter(id => {
      const isAdmin = participants.find(p => p.id === id)?.admin
      return!isAdmin // No expulsa admins
    });

  if (!targets.length) {
    return conn.reply(m.chat, `💖 *AVISO* 💖

╭─「 *ESTADO* 」─╮
│ *No hay usuarias validas para expulsar*
╰─────────────

> *Todo esta limpio dulzura* ✨`, m);
  }

  // Mensaje de advertencia antes de ejecutar
  await conn.reply(m.chat, `💖 *EJECUTANDO PROTOCOLO* 💖

╭─「 *LIMPIEZA* 」─╮
│ *OBJETIVOS* : ${targets.length}
│ *ESTADO* : Eliminando...
│ *AUTORA* : @${m.sender.split('@')[0]}
╰─────────────

> *Iniciando limpieza del grupo* 🧹`, m, { mentions: [m.sender] });

  await conn.groupParticipantsUpdate(m.chat, targets, 'remove');

  await conn.reply(m.chat, `💖 *PROTOCOLO COMPLETADO* 💖

╭─「 *REPORTE* 」─╮
│ *EXPULSADAS* : ${targets.length}
│ *ESTADO* : Grupo limpio
│ *POR* : @${m.sender.split('@')[0]}
╰─────────────

> *El grupo ha sido purificado* 😤🌸`, m, { mentions: [m.sender] });
};

handler.help = ['kickall'];
handler.tags = ['group'];
handler.command = ['kickall'];
handler.admin = true;
handler.botAdmin = true;
handler.group = true

export default handler;