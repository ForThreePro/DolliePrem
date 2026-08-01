import fetch from 'node-fetch'

const MARCA = 'DOLLIE BOT 🌸'
const TZ = 'America/Lima'

let handler = async (m, { conn, text }) => {
  await conn.sendMessage(m.chat, { react: { text: '💖', key: m.key } }).catch(_=>{})

  if (!text ||!text.includes('/')) {
    return m.reply(`╭─🌸─❒ *『 𝗗𝗢𝗟𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🌸─╮
│
│ *💱 CASITA DE CAMBIOS* 💱
│
│ *USO:*
│.cambio [monto] / [CODIGO] / [CODIGO]
│
│ *EJEMPLOS:*
│.cambio 100 / PEN / USD → Oficial
│.cambio 100 / USD / ARS → BLUE 🇦🇷
│.cambio 100 / ARS / PEN → BLUE Inverso 🇦🇷
│
│ *MONEDAS:* PEN, USD, EUR, ARS, COP, MXN, BRL...
│
│ > *¡Te convierto todo con mucho amor!* 🎀
╰─────────────────────────🌸`)
  }

  let [montoStr, de, a] = text.split('/').map(v => v.trim().toUpperCase())
  let monto = parseFloat(montoStr.replace(/,/g, ''))

  if (isNaN(monto) || monto <= 0) return m.reply(`😿 *ayy dulzura...* ese monto no es válido 🥺\nNecesito un número bonito`)
  if (de.length!== 3 || a.length!== 3) return m.reply(`💖 *bb usa códigos de 3 letritas:* PEN, USD, ARS`)
  if (de === a) return m.reply(`🌸 *${monto} ${de}* = *${monto} ${a}* \n*¡Son la misma monedita dulzura!* 🍥`)

  try {
    let tasaUSD_ARS = null
    let tipoTasa = 'OFICIAL'

    if (de === 'ARS' || a === 'ARS') {
      let resBlue = await fetch('https://dolarapi.com/v1/dolares/blue')
      let jsonBlue = await resBlue.json()
      if(!jsonBlue.venta) throw new Error('La API se puso triste')
      tasaUSD_ARS = jsonBlue.venta
      tipoTasa = 'BLUE 🔵'
    }

    let total
    if (de === 'USD' && a === 'ARS') total = (monto * tasaUSD_ARS).toFixed(2)
    else if (de === 'ARS' && a === 'USD') total = (monto / tasaUSD_ARS).toFixed(2)
    else if (de === 'ARS') {
      let res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
      let json = await res.json()
      total = ((monto / tasaUSD_ARS) * json.rates[a]).toFixed(2)
    }
    else if (a === 'ARS') {
      let res = await fetch(`https://api.exchangerate-api.com/v4/latest/${de}`)
      let json = await res.json()
      total = ((monto * json.rates.USD) * tasaUSD_ARS).toFixed(2)
    }
    else {
      let res = await fetch(`https://api.exchangerate-api.com/v4/latest/${de}`)
      let json = await res.json()
      if(!json.rates[a]) throw new Error('Esa monedita no existe bb')
      total = (monto * json.rates[a]).toFixed(2)
    }

    let fecha = new Date().toLocaleDateString('es-PE', { timeZone: TZ })

    let txt = `╭─🌸─❒ *『 𝗗𝗢𝗟𝗟𝗜𝗘 𝗕𝗢𝗧 』* ❒─🌸─╮
│
│ *💰 CONVERSIÓN TIERNA* 💰
│ ${monto} *${de}*
│ ⬇️ *¡Magia de hadas!* ✨
│ *${total}* *${a}*
│
│ *📊 TASA:* ${tipoTasa}
${tasaUSD_ARS? `│ *1 USD* = *${tasaUSD_ARS}* ARS` : ''}
│ *📅 FECHA:* ${fecha}
│
╰─────────────────────────🌸
> *${MARCA}* | Datos con mucho amor 💋`

    m.reply(txt)

  } catch(e) {
    console.log(e)
    m.reply(`😿 *ayy errorcito* 😿\n\n*Detalle:* ${e.message}\n\n*Revisa los códigos bb:* PEN, USD, ARS, COP...`)
  }
}

handler.help = ['cambio ( Monedas )']
handler.tags = ['finanzas']
handler.command = /^cambio$/i
handler.group = true
export default handler