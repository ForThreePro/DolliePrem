import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const fetchStickerVideo = async (text) => {
const response = await axios.get(`https://skyzxu-brat.hf.space/brat-animated`, { params: { text }, responseType: 'arraybuffer' })
if (!response.data) throw new Error('error al obtener el video de la api.')
return response.data
}

const handler = async (m, { conn, text }) => {
try {
text = m.quoted?.text || text
if (!text) return conn.sendMessage(m.chat, { text: `🍕 *responde a un mensaje o ingresa un texto para crear el sticker*` }, { quoted: m })

await m.react('🕒')
const videoBuffer = await fetchStickerVideo(text)

// SIN MARCA DE AGUA NI PACK
const stickerBuffer = await sticker(videoBuffer, false)
await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
await m.react('✅')

} catch (e) {
await m.react('❌')
conn.sendMessage(m.chat, { text: `😿 *ocurrió un error*\n\n*Detalle:* ${e.message}` }, { quoted: m })
}}

handler.tags = ['sticker']
handler.help = ['brat']
handler.command = ['brat']

export default handler