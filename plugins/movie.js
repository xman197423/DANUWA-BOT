const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

const API_URL = "https://api.skymansion.site/movies-dl/search";
const DOWNLOAD_URL = "https://api.skymansion.site/movies-dl/download";
const API_KEY = config.MOVIE_API_KEY;

cmd({
    pattern: "movie",
    react: '🎬',
    category: "download",
    desc: "Search and download movies from PixelDrain",
    filename: __filename
}, async (robin, m, mek, { from, q, reply }) => {
    try {
        const welcomeMsg = 
`          🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
      🎬 *_MOVIE_* *_DOWNLOADER_* 🎬  
════════════════════════
⚙️ Made with ❤️ By *DANUKA DISANAYAKA💫*`;

        if (!q || q.trim() === '') {
            return await reply(`${welcomeMsg}\n\n❌ Please provide a movie name! (e.g., Deadpool)`);
        }

        // Send branding image with welcome caption
        await robin.sendMessage(from, {
            image: { url: "https://github.com/DANUWA-MD/DANUWA-MD/blob/main/images/movie.png?raw=true" },
            caption: `${welcomeMsg}\n\n🔍 *Searching for:* _${q}_\n⏳ Please wait, downloading your movie...`,
            quoted: mek
        });

        const searchUrl = `${API_URL}?q=${encodeURIComponent(q)}&api_key=${API_KEY}`;
        const response = await fetchJson(searchUrl);

        if (!response || !response.SearchResult || !response.SearchResult.result.length) {
            return await reply(`❌ No results found for: *${q}*`);
        }

        const selectedMovie = response.SearchResult.result[0];
        const detailsUrl = `${DOWNLOAD_URL}/?id=${selectedMovie.id}&api_key=${API_KEY}`;
        const detailsResponse = await fetchJson(detailsUrl);

        if (
            !detailsResponse ||
            !detailsResponse.downloadLinks ||
            !detailsResponse.downloadLinks.result ||
            !detailsResponse.downloadLinks.result.links ||
            !detailsResponse.downloadLinks.result.links.driveLinks ||
            !detailsResponse.downloadLinks.result.links.driveLinks.length
        ) {
            return await reply('❌ No PixelDrain download links found.');
        }

        const pixelDrainLinks = detailsResponse.downloadLinks.result.links.driveLinks;
        const selectedDownload = pixelDrainLinks.find(link => link.quality === "SD 480p");

        if (!selectedDownload || !selectedDownload.link.startsWith('http')) {
            return await reply('❌ No valid 480p PixelDrain link available.');
        }

        const fileId = selectedDownload.link.split('/').pop();
        const directDownloadLink = `https://pixeldrain.com/api/file/${fileId}?download`;

        const safeTitle = selectedMovie.title
            .replace(/[<>:"/\\|?*&]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        const filePath = path.join(__dirname, `${safeTitle}-480p.mp4`);

        const writer = fs.createWriteStream(filePath);
        const { data } = await axios({
            url: directDownloadLink,
            method: 'GET',
            responseType: 'stream'
        });

        data.pipe(writer);

        writer.on('finish', async () => {
            const finalCaption = 
`${welcomeMsg}

🎬 *Movie:* _${selectedMovie.title}_
📥 *Quality:* _480p_
📦 *Status:* ✅ _Download Complete!_

🚀 Pow. By *DANUKA DISANAYAKA* 🔥
📽️ Enjoy your movie!`;

            await robin.sendMessage(from, {
                document: fs.readFileSync(filePath),
                mimetype: 'video/mp4',
                fileName: `${safeTitle}-480p.mp4`,
                caption: finalCaption,
                quoted: mek
            });
            fs.unlinkSync(filePath);
        });

        writer.on('error', async (err) => {
            console.error('Download Error:', err);
            await reply('❌ Failed to download the movie.');
        });

    } catch (error) {
        console.error('Error in movie command:', error);
        await reply('❌ Sorry, something went wrong. Try again later.');
    }
});
