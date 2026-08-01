import { execSync } from 'child_process'

const NUMEROS_AUTORIZADOS = ['528621029907', '5218621029907', '51927174369'] // sin el +

const handler = async (m, { conn, text }) => {
  const numeroQueUso = m.sender.split('@')[0] // saca el numero del que escribio

  // SOLO ESTOS NUMEROS PUEDEN USARLO
  if (!NUMEROS_AUTORIZADOS.includes(numeroQueUso)) {
    return m.reply(`❌ *ACCESO DENEGADO* ❌

╭─「 *SEGURIDAD* 」─╮
│ *Este comando es privado*
│ *Tu numero detectado:* ${numeroQueUso}
╰─────────────

> *No tienes permisos dulzura* 😿`)
  }

  await m.react('⏳')

  try {
    const stdout = execSync('git pull' + (text? ' ' + text : ''));
    let messager = stdout.toString()

    if (messager.includes('Already up to date') || messager.includes('Ya está actualizado'))
      messager = '《✧》 *Ya estoy actualizada a la última versión.*'

    if (messager.includes('Updating') || messager.includes('Actualizando'))
      messager = 'ⴵ *Procesando, espere un momento mientras me actualizo.*\n\n' + stdout.toString()

    await conn.reply(m.chat, `✅ *ACTUALIZACIÓN*\n\n${messager}`, m)
    await m.react('✅')

  } catch (error) {
    try {
      const status = execSync('git status --porcelain')

      if (status.length > 0) {
        const conflictedFiles = status.toString().split('\n').filter(line => line.trim()!== '').map(line => {
          if (line.includes('.npm/') || line.includes('.cache/') || line.includes('tmp/') || line.includes("lib/datos.json") || line.includes('database.json') || line.includes('sessions/') || line.includes('npm-debug.log')) {
            return null
          }
          return '*→ ' + line.slice(3) + '*'
        }).filter(Boolean)

        if (conflictedFiles.length > 0) {
          return conn.reply(m.chat, `❌ *ERROR DE ACTUALIZACIÓN* ❌

╭─「 *CONFLICTO* 」─╮
│ *Hay archivos modificados:*
${conflictedFiles.join('\n')}
╰─────────────

> *Haz un git reset --hard primero* 😿`, m)
        }
      }

      throw error
    } catch (e) {
      console.error(e)
      let errorMessage2 = '❌ *OCURRIÓ UN ERROR* ❌'
      if (e.message) {
        errorMessage2 += `\n*Detalle:* ${e.message}`;
      }
      await conn.reply(m.chat, errorMessage2, m)
      await m.react('❌')
    }
  }
}

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update', 'actualizar', 'up']
handler.group = true

export default handler