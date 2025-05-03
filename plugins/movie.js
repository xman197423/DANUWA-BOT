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
    alias: ["moviedl", "films"],
    react: '🎬',
    category: "download",
    desc: "Search and download movies from PixelDrain",
    filename: __filename
}, async (robin, m, mek, { from, q, reply }) => {
    try {
        if (!q || q.trim() === '') {
            return await reply('❌ Please provide a movie name! (e.g., Deadpool)');
        }

        // Fetch movie search results
        const searchUrl = `${API_URL}?q=${encodeURIComponent(q)}&api_key=${API_KEY}`;
        const response = await fetchJson(searchUrl);

        if (!response || !response.SearchResult || !response.SearchResult.result.length) {
            return await reply(`❌ No results found for: *${q}*`);
        }

        const selectedMovie = response.SearchResult.result[0]; // Use first result
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

        // Select 480p link
        const pixelDrainLinks = detailsResponse.downloadLinks.result.links.driveLinks;
        const selectedDownload = pixelDrainLinks.find(link => link.quality === "SD 480p");

        if (!selectedDownload || !selectedDownload.link.startsWith('http')) {
            return await reply('❌ No valid 480p PixelDrain link available.');
        }

        // Direct download link
        const fileId = selectedDownload.link.split('/').pop();
        const directDownloadLink = `https://pixeldrain.com/api/file/${fileId}?download`;

        // Create safe filename
        const safeTitle = selectedMovie.title
            .replace(/[<>:"/\\|?*&]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        const filePath = path.join(__dirname, `${safeTitle}-480p.mp4`);

        // Downloading...
        const writer = fs.createWriteStream(filePath);
        const { data } = await axios({
            url: directDownloadLink,
            method: 'GET',
            responseType: 'stream'
        });

        data.pipe(writer);

        writer.on('finish', async () => {
            await robin.sendMessage(from, {
                document: fs.readFileSync(filePath),
                mimetype: 'video/mp4',
                fileName: `${safeTitle}-480p.mp4`,
                caption: `🎬 *${selectedMovie.title}*\n📌 Quality: 480p\n✅ *Download Complete!*`,
                quoted: mek
            });
            fs.unlinkSync(filePath); // Delete file after upload
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
