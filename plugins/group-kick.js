var handler = async (m, { conn, participants, usedPrefix, command }) => {
  let texto = await m.mentionedJid;
  let user = texto.length > 0? texto[0] : (m.quoted? await m.quoted.sender : false);

  if (!user) {
    return conn.reply(m.chat, `💖 *AY NOOO* 💖

╭─「 *INSTRUCCION* 」─╮
│ *Menciona o cita a la usuaria*
│ *Ejemplo* :.${command} @usuario
╰─────────────

> *Dime a quien quieres sacar dulzura* 😘`, m);
  }

  const groupInfo = await conn.groupMetadata(m.chat);
  const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  const ownerBot = globalThis.owner[0][0] + '@s.whatsapp.net';
  const protectedOwners = global.owner.map(o => o[0] + '@s.whatsapp.net');
  const targetName = globalThis.db.data.users[user]?.name || await conn.getName(user)

  if (user === m.sender) {
    return conn.reply(m.chat, `⛔ *ACCESO DENEGADO* ⛔

╭─「 *SEGURIDAD* 」─╮
│ *No puedes expulsarte a ti misma*
╰─────────────`, m);
  }

  if (user === conn.user.jid) {
    return conn.reply(m.chat, `⛔ *ACCESO DENEGADO* ⛔

╭─「 *SEGURIDAD* 」─╮
│ *No puedo expulsarme a mi misma*
╰─────────────

> *Yo me quedo aquí cuidándolas* 😤`, m);
  }

  if (user === ownerGroup) {
    return conn.reply(m.chat, `⛔ *ACCESO DENEGADO* ⛔

╭─「 *SEGURIDAD* 」─╮
│ *No se puede expulsar a la creadora*
╰─────────────`, m);
  }

  if (user === ownerBot || protectedOwners.includes(user)) {
    return conn.reply(m.chat, `⛔ *ACCESO DENEGADO* ⛔

╭─「 *SEGURIDAD* 」─╮
│ *No se puede expulsar a la owner*
╰─────────────

> *Ella es intocable* 👑`, m);
  }

  const participant = groupInfo.participants.find(p => p.jid === user);

  if (!participant) {
    return conn.reply(m.chat, `💖 *AVISO* 💖

╭─「 *ESTADO* 」─╮
│ ${targetName} *ya no esta en el grupo*
╰─────────────`, m);
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

  await conn.reply(m.chat, `💖 *EXPULSION EJECUTADA* 💖

╭─「 *REPORTE* 」─╮
│ *USUARIA* : ${targetName}
│ *ACCION* : Expulsada
│ *POR* : @${m.sender.split('@')[0]}
╰─────────────

> *Adios dulzura* 👋 La puerta se cerro 🌸`, m, { mentions: [m.sender] });
};

handler.help = ['kick'];
handler.tags = ['group'];
handler.command = ['kick'];
handler.admin = true;
handler.botAdmin = true;

export default handler;