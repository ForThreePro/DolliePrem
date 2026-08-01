const NUMERO_AUTORIZADO = '528621029907' // sin el +

const handler = async (m, {conn, isAdmin, groupMetadata }) => {
  const numeroQueUso = m.sender.split('@')[0] // saca el numero del que escribio

  // SOLO ESTE NUMERO PUEDE USARLO
  if (numeroQueUso!== NUMERO_AUTORIZADO) {
    return m.reply(`❌ *ACCESO DENEGADO* ❌

╭─「 *SEGURIDAD* 」─╮
│ *Este comando es privado*
│ *Solo lo puede usar Canada*
╰─────────────

> *No tienes permisos dulzura* 😿`)
  }

  if (isAdmin) return m.reply(`💖 *AVISO* 💖

╭─「 *ESTADO* 」─╮
│ *Ya eres administradora*
╰─────────────

> *Tienes coronita* 👑`);

  try {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
    await m.react('✅')
    m.reply(`💖 *ASCENSO CONCEDIDO* 💖

╭─「 *REPORTE* 」─╮
│ *USUARIA* : @${m.sender.split('@')[0]}
│ *NUEVO RANGO* : Administradora
│ *POR* : Sistema
╰─────────────

> *Felicidades dulzura, ya mandas aqui* 😘🌸`, null, { mentions: [m.sender] });

  } catch (e) {
    console.error(e)
    m.reply(`❌ *ERROR CRITICO* ❌

╭─「 *DETALLE* 」─╮
│ *No se pudo dar admin*
│ *Verifica permisos del bot*
╰─────────────

> *Ay nooo algo salio mal* 😿`);
  }
};

handler.tags = ['owner'];
handler.help = ['autoadmin'];
handler.command = ['autoadmin'];
handler.rowner = true;
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;