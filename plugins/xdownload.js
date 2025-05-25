const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchJson(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("fetchJson Error:", error.message);
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
        }
        return null;
    }
}

function hi() {
    console.log("Hello World!");
}
hi();

// Commande principale du bot
cmd({
    pattern: "xdownload",
    alias: ["xnxxdl", "xxx"],
    react: "📥",
    desc: "Download videos from Xvideos.",
    category: "utility",
    filename: __filename
}, async (client, message, args, { q: query, reply }) => {
    try {
        if (!query) {
            return reply("❌ Please provide a valid Xvideos URL.");
        }

        const apiUrl = `https://api.giftedtech.web.id/api/download/xvideosdl?apikey=gifted&url=${encodeURIComponent(query)}`;
        console.log("Requesting API with URL:", apiUrl);

        const data = await fetchJson(apiUrl);
        if (!data || !data.result) {
            console.log("❌ Failed to fetch video. Please check the URL or try again later.");
            return reply("❌ Failed to fetch video. Please check the URL or try again later.");
        }

        const result = data.result;
        const videoUrl = result.download_url;
        const title = result.title.replace(/[<>:"/\\|?*]/g, '');
        const filePath = path.join(__dirname, `${title}.mp4`);

        console.log("GAMER-XMD Downloading video...");

        const response = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log("GAMER-XMD downloaded video successfully:", filePath);

        await client.sendMessage(message.chat, {
            video: fs.readFileSync(filePath),
            caption: `*GAMER-XMD XVIDEOS DL*\n\n🎥 *Title:* ${result.title}\n👀 *Views:* ${result.views}\n👍 *Likes:* ${result.likes}`
        });

        fs.unlinkSync(filePath);
        console.log("Video sent and file cleaned up.");
    } catch (err) {
        console.error("Unexpected Error:", err.message);
        reply("❌ An error occurred while processing your request. Please try again.");
    }
});