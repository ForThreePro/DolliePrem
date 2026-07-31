import axios from 'axios'
import fetch from "node-fetch"
import yts from 'yt-search'

let handler = async (m, { conn, text, command, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, `💖 *CENTRO DE DESCARGAS* 💖

╭─「 *MODULO* 」─╮
│ *ESTADO* : Online y coqueta 😘
╰─────────────

├─「 *YOUTUBE* 」
│ [1] *.play* nombre → Audio
│ [2] *.play2* nombre → Video
│ [3] *.ytmp3* link → Audio Directo
│ [4] *.ytmp4* link → Video 720p
│
├─「 *SOCIAL* 」
│ [5] *.spotify* nombre → Audio
│ [6] *.tiktok* link → Video
│ [7] *.tiktoksearch* txt → Buscar
│ [8] *.ig* link → Instagram
│ [9] *.fb* link → Facebook
│ [10] *.mediafire* link → Archivo
╰─────────────

> *Pídeme lo que quieras y te lo bajo dulzura* 🌸`, m)

    await m.react('⏳')
    const keyEvo = Buffer.from('ZWt1c2Fz', 'base64').toString('utf-8').split('').reverse().join('')
    const keySasuke = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')

    try {
        // ===== PLAY / PLAY2 YOUTUBE BUSQUEDA =====
        if (/^(play|play2)$/i.test(command)) {
            let res = await yts(text)
            let vid = res.videos[0]
            if (!vid) throw 'YT_NOT_FOUND'

            await m.react('🔍')
            await m.react('⏳')

            let isVideo = command === 'play2'
            let apiUrl = isVideo
          ? `https://api.evogb.org/dl/ytmp4?url=${encodeURIComponent(vid.url)}&quality=720&key=${keySasuke}`
                : `https://api.evogb.org/dl/ytmp3?url=${encodeURIComponent(vid.url)}&key=${keySasuke}`

            let json = await (await fetch(apiUrl)).json()
            if (!json.status) throw 'YT_DL_ERROR'

            let cap = `💖 *YOUTUBE ${isVideo? 'VIDEO' : 'AUDIO'}* 💖

╭─「 *INFO* 」─╮
│ *TITULO* : ${vid.title}
│ *DURACION* : ${vid.timestamp}
│ *AUTOR* : ${vid.author.name}
│ *VISTAS* : ${vid.views.toLocaleString()}
│ *FORMATO* : ${isVideo? 'MP4 720p' : 'MP3 320kbps'}
╰─────────────

> *Listo dulzura, aquí tienes tu musiquita* 🌷`

            await conn.sendMessage(m.chat, { image: { url: vid.thumbnail }, caption: cap }, { quoted: m }) // USA FOTO DE YT
            await conn.sendMessage(m.chat, {
                [isVideo? 'video' : 'audio']: { url: json.data.dl },
                mimetype: isVideo? 'video/mp4' : 'audio/mpeg',
                fileName: `${vid.title}.${isVideo? 'mp4' : 'mp3'}`
            }, { quoted: m })
            return await m.react('✅')
        }

        // ===== YTMP3 / YTMP4 DIRECTO =====
        if (/^(ytmp3|ytmp4)$/i.test(command)) {
            let res = await yts(text)
            let vid = res.videos[0]
            if (!vid) throw 'YT_NOT_FOUND'

            await m.react('⏳')

            let isVideo = command === 'ytmp4'
            let apiUrl = isVideo
           ? `https://api.evogb.org/dl/ytmp4?url=${encodeURIComponent(vid.url)}&quality=720&key=${keySasuke}`
                : `https://api.evogb.org/dl/ytmp3?url=${encodeURIComponent(vid.url)}&key=${keySasuke}`

            let json = await (await fetch(apiUrl)).json()
            if (!json.status) throw 'YT_DL_ERROR'

            let cap = `💖 *YT ${isVideo? 'VIDEO' : 'AUDIO'} DIRECTO* 💖

╭─「 *INFO* 」─╮
│ *TITULO* : ${vid.title}
│ *FORMATO* : ${isVideo? 'MP4 720p' : 'MP3'}
│ *DURACION* : ${vid.timestamp}
│ *VISTAS* : ${vid.views.toLocaleString()}
╰─────────────

> *Descarga iniciada, no te desesperes* 😘`

            await conn.sendMessage(m.chat, { image: { url: vid.thumbnail }, caption: cap }, { quoted: m }) // USA FOTO DE YT
            await conn.sendMessage(m.chat, {
                [isVideo? 'video' : 'audio']: { url: json.data.dl },
                mimetype: isVideo? 'video/mp4' : 'audio/mpeg',
                fileName: `${vid.title}.${isVideo? 'mp4' : 'mp3'}`
            }, { quoted: m })
            return await m.react('✅')
        }

        // ===== SPOTIFY =====
        if (/^(spotify)$/i.test(command)) {
            let searchRes = await fetch(`https://api.evogb.org/search/spotify?query=${encodeURIComponent(text)}&key=${keySasuke}`)
            let searchData = await searchRes.json()
            if (!searchData.status ||!searchData.result[0]) throw 'SP_NOT_FOUND'

            await m.react('🔍')
            await m.react('⏳')

            let song = searchData.result[0]
            let dlRes = await fetch(`https://api.evogb.org/dl/spotify?url=${encodeURIComponent(song.link)}&key=${keySasuke}`)
            let dlData = await dlRes.json()
            if (!dlData.status) throw 'SP_DL_ERROR'

            let cap = `🎵 *SPOTIFY* 🎵

╭─「 *INFO* 」─╮
│ *TITULO* : ${dlData.data.name}
│ *ARTISTA* : ${dlData.data.artist}
│ *ALBUM* : ${dlData.data.album}
│ *DURACION* : ${dlData.data.duration}
│ *ANO* : ${dlData.data.year}
╰─────────────

> *Para que lo escuches bien rico* 🌸`

            await conn.sendMessage(m.chat, { image: { url: dlData.data.image }, caption: cap }, { quoted: m }) // USA FOTO DE SPOTIFY
            await conn.sendMessage(m.chat, { audio: { url: dlData.data.url }, mimetype: 'audio/mpeg', fileName: `${dlData.data.name}.mp3` }, { quoted: m })
            return await m.react('✅')
        }

        // ===== TIKTOK =====
        if (/^(tiktok|tiktoksearch)$/i.test(command)) {
            if (command === 'tiktoksearch') {
                let res = await (await fetch(`https://api.evogb.org/search/tiktok?query=${text}&key=${keySasuke}`)).json()
                let video = res.data[0]
                if (!video) throw 'TT_NOT_FOUND'

                let caption = `💖 *TIKTOK SEARCH* 💖

╭─「 *INFO* 」─╮
│ *TITULO* : ${video.title}
│ *AUTOR* : ${video.author.nickname}
│ *VISTAS* : ${video.play_count.toLocaleString()}
│ *LIKES* : ${video.digg_count.toLocaleString()}
╰─────────────

> *Encontré esto para ti* 😘`
                await conn.sendFile(m.chat, video.dl, 'tiktok.mp4', caption, m) // NO USA FOTO
            } else {
                let res = await (await fetch(`https://api.evogb.org/dl/tiktok?url=${text}&key=${keySasuke}`)).json()
                let data = res.data
                if (!data) throw 'TT_DL_ERROR'

                let caption = `💖 *TIKTOK DOWNLOAD* 💖

╭─「 *INFO* 」─╮
│ *TITULO* : ${data.title}
│ *AUTOR* : ${data.author.nickname}
╰─────────────

> *Aquí tienes tu tiktok dulzura* 🌸`
                await conn.sendFile(m.chat, Array.isArray(data.dl)? data.dl[0] : data.dl, 'tiktok.mp4', caption, m) // NO USA FOTO
            }
            return await m.react('✅')
        }

        // ===== INSTAGRAM =====
        if (/^(ig|instagram)$/i.test(command)) {
            const { data } = await axios.get(`https://api.evogb.org/dl/instagram?url=${encodeURIComponent(text)}&key=${keyEvo}`)
            if (!data.status) throw 'IG_ERROR'
            let media = data.data[0]
            let type = media.type === 'video'? 'VIDEO' : 'IMAGEN'

            let cap = `📸 *INSTAGRAM* 📸

╭─「 *INFO* 」─╮
│ *TIPO* : ${type}
│ *ESTADO* : Enviando
╰─────────────

> *Te lo paso directo al chat* 😘`

            await conn.sendMessage(m.chat, {
                [media.type === 'video'? 'video' : 'image']: { url: media.url },
                mimetype: media.type === 'video'? 'video/mp4' : 'image/jpeg',
                caption: cap
            }, { quoted: m }) // NO USA FOTO DOLLIE
            return await m.react('✅')
        }

        // ===== FACEBOOK =====
        if (/^(fb|facebook)$/i.test(command)) {
            const { data } = await axios.get(`https://api.evogb.org/dl/facebook?url=${encodeURIComponent(text)}&key=${keyEvo}`)
            if (!data.status) throw 'FB_ERROR'
            let video = data.resultados[0]

            let cap = `📘 *FACEBOOK* 📘

╭─「 *INFO* 」─╮
│ *CALIDAD* : ${video.calidad || 'HD'}
│ *ESTADO* : Enviando
╰─────────────

> *Video listo para ti* 🌸`

            await conn.sendMessage(m.chat, {
                video: { url: video.url },
                mimetype: 'video/mp4',
                caption: cap
            }, { quoted: m }) // NO USA FOTO DOLLIE
            return await m.react('✅')
        }

        // ===== MEDIAFIRE =====
        if (/^(mediafire|mf|mediafiredl)$/i.test(command)) {
            let response = await fetch(`https://api.evogb.org/dl/mediafire?url=${encodeURIComponent(text)}&key=${keySasuke}`)
            let result = await response.json()
            if (!result.status ||!result.data) throw 'MF_ERROR'

            let { name, size, date, dl } = result.data
            let caption = `📦 *MEDIAFIRE* 📦

╭─「 *INFO* 」─╮
│ *NOMBRE* : ${name}
│ *TAMANO* : ${size}
│ *FECHA* : ${date}
╰─────────────

> *Archivo extraido con exito* 🌷`

            await conn.sendFile(m.chat, dl, name, caption, m) // NO USA FOTO DOLLIE
            return await m.react('✅')
        }

    } catch (e) {
        console.error(e)
        await m.react('❌')
        let msgs = {
            YT_NOT_FOUND: 'No se encontro el video',
            YT_DL_ERROR: 'Error en youtube',
            SP_NOT_FOUND: `No hay resultados: ${text}`,
            SP_DL_ERROR: 'Error en spotify',
            TT_NOT_FOUND: 'No hay resultados tt',
            TT_DL_ERROR: 'Error en tiktok',
            IG_ERROR: 'Error en instagram',
            FB_ERROR: 'Error en facebook',
            MF_ERROR: 'Archivo no encontrado'
        }
        m.reply(`❌ *ERROR* ❌

╭─「 *DETALLE* 」─╮
│ *DETALLE* : ${msgs[e] || 'Error inesperado'}
│ *ACCION* : Verifica el enlace
╰─────────────

> *Ay nooo, algo salio mal* 😿`)
    }
}

handler.help = ['play', 'play2', 'ytmp3', 'ytmp4', 'spotify', 'tiktok', 'tiktoksearch', 'ig', 'fb', 'mediafire']
handler.tags = ['downloader']
handler.command = /^(play|play2|ytmp3|ytmp4|spotify|tiktok|tiktoksearch|ig|instagram|fb|facebook|mediafire|mf|mediafiredl)$/i

export default handler