let handler = async (m, { conn }) => {
    let vcard = `BEGIN:VCARD
VERSION:3.0
N:;Sofia;;;
FN:Sofia
ORG:𝐃𝐎𝐋𝐋𝐈𝐄 𝐁𝐎𝐓
TEL;type=CELL;type=VOICE;waid=5218621029907:+52 1 862 102 9907
END:VCARD`

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: 'Sofia - DOLLIE BOT',
            contacts: [{ vcard }]
        }
    }, { quoted: m })

    await conn.reply(m.chat, `🎀 *𝐁𝐎𝐓 𝐃𝐎𝐋𝐈𝐄*

╭─「 👑 𝐂𝐑𝐄𝐀𝐃𝐎𝐑𝐀 」─╮
│
│ *𝐍𝐎𝐌𝐁𝐑𝐄:* 𝐒𝐨𝐟𝐢𝐚
│ *𝐍𝐔𝐌𝐄𝐑𝐎:* +52 862 102 9907
│ *𝐁𝐎𝐓:* 𝐃𝐎𝐋𝐋𝐈𝐄 𝐁𝐎𝐓
│
╰─────────────────╯

> 𝐀𝐠𝐫𝐞𝐠𝐚𝐦𝐞 𝐩𝐚𝐫𝐚 𝐬𝐨𝐩𝐨𝐫𝐭𝐞 🎀💕`, m)
}

handler.help = ['owner']
handler.tags = ['info']
handler.command = ['owner']
export default handler