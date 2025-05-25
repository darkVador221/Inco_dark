console.log('Hello World!');

const { cmd, commands } = require('../command');
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson
} = require('../lib/functions');
const axios = require('axios');

// Définition de la commande .rw ou .randomwallpaper
cmd({
  pattern: 'rw',
  alias: ['randomwall', 'wallpaper'],
  react: '🌌',
  desc: 'Download random wallpapers based on keywords.',
  category: 'wallpapers',
  use: '.rw <keyword>',
  filename: __filename
}, async (conn, msg, m, { from, args, reply }) => {
  try {
    const query = args.join(' ') || 'random';
    const apiURL = `https://pikabotzapi.vercel.app/random/randomwall/?apikey=anya-md&query=${query}`;

    const res = await axios.get(apiURL);

    if (res.data.imgUrl) {
      const imageUrl = res.data.imgUrl;
      const caption = `🌌 Random Wallpaper: *${query}*\n\n> *© Genreted By GAMER-XMD*`;

      await conn.sendMessage(from, {
        image: { url: imageUrl },
        caption: caption
      }, { quoted: msg });
    } else {
      reply(`❌ Failed to fetch wallpaper for "${query}".`);
    }
  } catch (err) {
    console.error(err);
    reply('❌ An error occurred while fetching the wallpaper.');
  }
});