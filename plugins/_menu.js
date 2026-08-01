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

const ICONOS_CATEGORIA = {
config: '⚙️', owner: '💛', fun: '😈', joda: '🪅', ff: '🎮', buscadores: '🔍',
descargas: '📥', grupo: '🌸', grupos: '🌸', gacha: '👥', ia: '🤖',
info: '⭐', sticker: '🎨', main: '🔧', tools: '🛍️', sorteos: '🎯'
}

const EMOJIS_RANDOM = ['🌸','🎀','🍥','💖','✨','🩰','💫','🧸']

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

// DETECTA TODAS LAS CATEGORIAS AHORA 🌸
const byTag = {}
for (const plugin of Object.values(global.plugins || {})) {
  if (plugin.disabled) continue
  const tags = Array.isArray(plugin.tags)? plugin.tags : (plugin.tags? [plugin.tags] : [])
  const helps = Array.isArray(plugin.help)? plugin.help : (plugin.help? [plugin.help] : [])
  for (const tag of tags) {
    const t = tag.toLowerCase()
    if (!byTag[t]) byTag[t] = new Set() // sin filtro
    for (const h of helps) if (typeof h === 'string' && h.trim()) byTag[t].add(h.trim())
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

// Ordena: primero las oficiales, luego las nuevas
const tagsOrdenados = Object.keys(byTag).sort((a, b) => {
  const aIn = CATEGORY_META[a]? 0 : 1
  const bIn = CATEGORY_META[b]? 0 : 1
  return aIn - bIn
})

for (const tag of tagsOrdenados) {
  const set = byTag[tag]
  if (!set || set.size === 0) continue
  const cmds = [...set].sort()

  // Si no existe, crea nombre tierno
  const nombreCat = CATEGORY_META[tag] || `🧸 *RINCÓN DE ${tag.toUpperCase()}*`
  const icono = ICONOS_CATEGORIA[tag] || EMOJIS_RANDOM[Math.floor(Math.random() * EMOJIS_RANDOM.length)]

  menuTexto += `\n╭─「 ${nombreCat} 」─╮\n`
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