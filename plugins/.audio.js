import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

let handler = async (m, { conn, isAdmin, command }) => {
    if (!m.isGroup) return m.reply('🍓 Solo en grupos')
    if (!isAdmin) return m.reply('🍓 *UPSITO* Solo admins fresita')
    if (!m.quoted || !/audio/.test(m.quoted.mtype)) return m.reply(`🍓 *Responde a un audio* con:\n.audiowelcome → para bienvenida\n.audiobye → para despedida`)
    
    let audio = await m.quoted.download()
    let dir = './media'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    
    let tempPath = path.join(dir, `temp_${m.chat}.ogg`)
    let finalPath = ''
    let tipo = ''
    
    // VER QUE COMANDO USO
    if (command === 'audiowelcome') {
        finalPath = path.join(dir, `welcome_${m.chat}.mp3`)
        tipo = 'bienvenida'
    } else if (command === 'audiobye') {
        finalPath = path.join(dir, `bye_${m.chat}.mp3`)
        tipo = 'despedida'
    }
    
    fs.writeFileSync(tempPath, audio)
    
    // CONVERTIR OGG A MP3
    await execAsync(`ffmpeg -i ${tempPath} -ar 44100 -ac 2 -b:a 128k ${finalPath}`)
    fs.unlinkSync(tempPath)
    
    return m.reply(`🍓 *LISTO FRESITA* 💕\nAudio de ${tipo} guardado para este grupo\nCada que ${tipo === 'bienvenida' ? 'entre' : 'salga'} alguien sonará este audio`)
}
handler.help = ['audiowelcome', 'audiobye']
handler.tags = ['group']
handler.command = ['audiowelcome', 'audiobye']
export default handler