let handler = async (m, { conn }) => {
    let vcard = `BEGIN:VCARD
VERSION:3.0
N:;Sofia;;;
FN:Sofia
ORG:𝐃𝐎𝐋𝐋𝐈𝐄 𝐁𝐎𝐓
TEL;type=CELL;type=VOICE;waid=528621029907:+52 862 102 9907
TEL;type=CELL;type=VOICE;waid=5218621029907:+52 1 862 102 9907
END:VCARD`

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: 'Sofia',
            contacts: [{ vcard }]
        }
    }, { quoted: m })

    await conn.reply(m.chat, `🎀 *𝐁𝐎𝐓 𝐃𝐎𝐋𝐈𝐄*

╭─「 👑 𝐂𝐑𝐄𝐀𝐃𝐎𝐑𝐀 」─╮
│
│ *𝐍𝐎𝐌𝐁𝐑𝐄:* 𝐒𝐨𝐟𝐢𝐚
│ *𝐍𝐔𝐌𝐄𝐑𝐎:* +52 862 102 9907
│ *𝐄𝐒𝐓𝐀𝐃𝐎:* 𝐑𝐞𝐢𝐧𝐚 𝐃𝐨𝐥𝐥𝐢𝐞 ✨
│
╰─────────────────╯

> 𝐄𝐬𝐜𝐫𝐢𝐛𝐞𝐦𝐞 𝐛𝐨𝐧𝐢𝐭𝐨 𝐬𝐢𝐧 𝐬𝐩𝐚𝐦 🎀💕`, m)
}

handler.help = ['owner']
handler.tags = ['info']
handler.command = ['owner']
export default handler