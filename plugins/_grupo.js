let handler = async (m, { conn, isAdmin, command }) => {
    if (!m.isGroup) return m.reply(`*🎀 𝐁𝐎𝐓 𝐃𝐎𝐋𝐋𝐈𝐄 𝐏𝐑𝐄𝐌*\n\n❌ 𝐄𝐬𝐭𝐞 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐬𝐨𝐥𝐨 𝐟𝐮𝐧𝐜𝐢𝐨𝐧𝐚 𝐞𝐧 𝐠𝐫𝐮𝐩𝐨𝐬`)
    if (!isAdmin) return m.reply(`*🎀 𝐁𝐎𝐓 𝐃𝐎𝐋𝐋𝐈𝐄 𝐏𝐑𝐄𝐌*\n\n❌ 𝐒𝐨𝐥𝐨 𝐚𝐝𝐦𝐢𝐧𝐬 𝐩𝐮𝐞𝐝𝐞𝐧 𝐮𝐬𝐚𝐫 𝐞𝐬𝐭𝐞 𝐜𝐨𝐦𝐚𝐧𝐝𝐨`)

    try {
        if(command === 'abrir' || command === 'open'){
            await conn.groupSettingUpdate(m.chat, 'not_announcement')
            await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

            let txt = `🥳 *𝐄𝐒𝐓𝐄 𝐆𝐑𝐔𝐏𝐎 𝐇𝐀 𝐒𝐈𝐃𝐎* \`𝐀𝐁𝐈𝐄𝐑𝐓𝐎\` 🔓
*𝐏𝐎𝐑* @${m.sender.split('@')[0]}

> 𝐓𝐨𝐝𝐨𝐬 𝐩𝐮𝐞𝐝𝐞𝐧 𝐞𝐬𝐜𝐫𝐢𝐛𝐢𝐫`

            await conn.reply(m.chat, txt, m, { mentions: [m.sender] })

        } else if(command === 'cerrar' || command === 'close'){
            await conn.groupSettingUpdate(m.chat, 'announcement')
            await conn.sendMessage(m.chat, { react: { text: '🔒', key: m.key } })

            let txt = `🔒 *𝐄𝐒𝐓𝐄 𝐆𝐑𝐔𝐏𝐎 𝐇𝐀 𝐒𝐈𝐃𝐎* \`𝐂𝐄𝐑𝐑𝐀𝐃𝐎\`
*𝐏𝐎𝐑* @${m.sender.split('@')[0]}

> 𝐒𝐨𝐥𝐨 𝐚𝐝𝐦𝐢𝐧𝐬 𝐩𝐮𝐞𝐝𝐞𝐧 𝐞𝐬𝐜𝐫𝐢𝐛𝐢𝐫`

            await conn.reply(m.chat, txt, m, { mentions: [m.sender] })
        }
    } catch (e) {
        console.error(e)
        if(e.message.includes('not-admin')) {
            return m.reply(`*🎀 𝐁𝐎𝐓 𝐃𝐎𝐋𝐋𝐈𝐄 𝐏𝐑𝐄𝐌*\n\n❌ 𝐍𝐞𝐜𝐞𝐬𝐢𝐭𝐨 𝐬𝐞𝐫 𝐚𝐝𝐦𝐢𝐧 𝐩𝐚𝐫𝐚 𝐡𝐚𝐜𝐞𝐫 𝐞𝐬𝐨`)
        }
        await m.reply(`❌ 𝐄𝐑𝐑𝐎𝐑: ${e.message}`)
    }
}

handler.help = ['abrir', 'cerrar']
handler.tags = ['group']
handler.command = ['abrir', 'cerrar', 'open', 'close']
handler.admin = true
export default handler