import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

let handler = async (m, { conn, isAdmin, command }) => {
    if (!m.isGroup) return m.reply('🍓 Solo en grupos')
    if (!isAdmin) return m.reply('🍓 *UPSITO* Solo admins fresita')
    
    let dir = './media'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)

    // ===== GUARDAR AUDIO =====
    if (command === 'audiowelcome' || command === 'audiobye') {
        if (!m.quoted || !/audio/.test(m.quoted.mtype)) return m.reply(`🍓 *Responde a un audio* con:\n.audiowelcome → para bienvenida\n.audiobye → para despedida`)
        
        let audio = await m.quoted.download()
        let tempPath = path.join(dir, `temp_${m.chat}.ogg`)
        let finalPath = ''
        let tipo = ''
        
        if (command === 'audiowelcome') {
            finalPath = path.join(dir, `welcome_${m.chat}.mp3`)
            tipo = 'bienvenida'
        } else {
            finalPath = path.join(dir, `bye_${m.chat}.mp3`)
            tipo = 'despedida'
        }
        
        fs.writeFileSync(tempPath, audio)
        await execAsync(`ffmpeg -i ${tempPath} -ar 44100 -ac 2 -b:a 128k ${finalPath}`)
        fs.unlinkSync(tempPath)
        
        return m.reply(`🍓 *LISTO FRESITA* 💕\nAudio de ${tipo} guardado para este grupo`)
    }

    // ===== BORRAR AUDIO =====
    if (command === 'delaudiowelcome' || command === 'delaudiobye') {
        let filePath = ''
        let tipo = ''
        
        if (command === 'delaudiowelcome') {
            filePath = path.join(dir, `welcome_${m.chat}.mp3`)
            tipo = 'bienvenida'
        } else {
            filePath = path.join(dir, `bye_${m.chat}.mp3`)
            tipo = 'despedida'
        }

        if (!fs.existsSync(filePath)) return m.reply(`🍓 Este grupo no tiene audio de ${tipo} guardado`)
        
        fs.unlinkSync(filePath)
        return m.reply(`🍓 *BORRADO* 💕\nAudio de ${tipo} eliminado\nAhora solo mandará imagen + texto`)
    }

}
handler.help = ['audiowelcome', 'audiobye', 'delaudiowelcome', 'delaudiobye']
handler.tags = ['group']
handler.command = ['audiowelcome', 'audiobye', 'delaudiowelcome', 'delaudiobye']
export default handler