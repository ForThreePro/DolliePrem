import moment from 'moment-timezone'
import os from 'os'

const CATEGORY_META = {
config: '⚙️ *CONFIG*',
main: '🔧 *PRINCIPAL*',
tools: '🛍️ *HERRAMIENTAS*',
owner: '🥇 *OWNER*',
sorteos: '🎯 *SORTEOS*',
fun: '😈 *DIVERSIÓN*',
joda: '🎭 *JODA*',
ff: '🎮 *FREE FIRE*',
buscadores: '🔍 *BÚSQUEDA*',
descargas: '📥 *DESCARGAS*',
grupo: '🌸 *GRUPOS*',
grupos: '🛡️ *GRUPO*',
gacha: '👥 *GACHA*',
ia: '🤖 *INTELIGENCIA*',
info: 'ℹ️ *INFO*',
sticker: '🎨 *STICKER*',
}

let handler = async (m, { conn }) => {
try {
await conn.sendMessage(m.chat, { react: { text: '💖', key: m.key } })

const fecha = moment.tz('America/Lima').format('dddd')
const fecha2 = moment.tz('America/Lima').format('DD [de] MMMM [de] YYYY')
const hora = moment.tz('America/Lima').format('hh:mm:ss a')
const uptime = process.uptime()
const horas = Math.floor(uptime / 3600)
const minutos = Math.floor((uptime % 3600) / 60)
const segundos = Math.floor(uptime % 60)
const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
const totalram = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
const pluginsCount = Object.values(global.plugins || {}).filter(p =>!p?.disabled).length
const totalUsers = Object.keys(global.db.data.users || {}).length

const byTag = {}
for (const plugin of Object.values(global.plugins || {})) {
  if (plugin.disabled) continue
  const tags = Array.isArray(plugin.tags)? plugin.tags : (plugin.tags? [plugin.tags] : [])
  const helps = Array.isArray(plugin.help)? plugin.help : (plugin.help? [plugin.help] : [])
  for (const tag of tags) {
    if (!CATEGORY_META[tag]) continue
    if (!byTag[tag]) byTag[tag] = new Set()
    for (const h of helps) if (typeof h === 'string' && h.trim()) byTag[tag].add(h.trim())
  }
}

const userName = m.pushName || 'Dulzura'
const IMG_MENU = 'https://files.evogb.win/7MjPua.jpg' // FOTO DOLLIE

let menuTexto = `🌸 *𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓*.୨୧

⤷ ┇ *VERSION* : v3.0 Dollie ：✦ 。
╰─ ◈ *ONLINE* • ${horas}h ${minutos}m ${segundos}s

╭─「 👤 *USUARIA* 」─╮
│ 🥳 @${userName} ୨ৎ
│ 💬 "Lista para consentirte dulzura"
╰────────────────╯

──⭐ *ESTADISTICAS* ╏ 📊
👥 *Usuarios* : ${totalUsers} | 📜 *Comandos* : ${pluginsCount}
💾 *RAM* : ${ram}mb | 🌐 *Servidor* : ${totalram}gb

──🔧 *SISTEMA* 🔧──
📅 *Dia* : ${fecha}
📆 *Fecha* : ${fecha2}
🕐 *Hora* : ${hora} | 📡 *Ping* : ${Math.round(performance.now())}ms

`

for (const tag of Object.keys(CATEGORY_META)) {
  const set = byTag[tag]
  if (!set || set.size === 0) continue
  const cmds = [...set].sort()

  let icono = '🛍️'
  if(tag === 'config') icono = '⚙️'
  if(tag === 'owner') icono = '💛'
  if(tag === 'fun') icono = '😈'
  if(tag === 'ff') icono = '🔫'
  if(tag === 'buscadores') icono = '🔍'
  if(tag === 'descargas') icono = '📥'
  if(tag === 'grupo') icono = '🌸'
  if(tag === 'grupos') icono = '🌸'
  if(tag === 'gacha') icono = '👥'
  if(tag === 'ia') icono = '🤖'
  if(tag === 'info') icono = '⭐'
  if(tag === 'sticker') icono = '🎨'
  if(tag === 'tools') icono = '🛍️'
  if(tag === 'joda') icono = '🪅'

  menuTexto += `\n╭─「 ${CATEGORY_META[tag]} 」─╮\n`
  menuTexto += cmds.map(c => `│ ${icono}.${c}`).join('\n') + '\n'
  menuTexto += `╰─────── ୨୧ ────╯\n`
}

menuTexto += `
🪄━━━━━━━━━━━━━━━ 🎀
🛍️ *BOT* : 𝐃𝐎𝐋𝐈𝐄 𝐁𝐎𝐓
🌸 *CREADORA* : Tu dulzura favorita
🩰 *VERSION* : 3.0 Tierna

> "Conéctate y déjame endulzarte el dia" 🍥
`

await conn.sendMessage(m.chat, {
  image: { url: IMG_MENU },
  caption: menuTexto.trim(),
  mentions: [m.sender]
}, { quoted: m })

} catch (e) {
await conn.sendMessage(m.chat, { text: `❌ *ERROR* ❌\n\n> *Ay nooo algo salió mal* 😿\n*Detalle*: ${e.message}` }, { quoted: m })
}
}

handler.help = ['menu']
handler.tags = ['info']
handler.command = ['menu', 'help', 'menudollie']

export default handler