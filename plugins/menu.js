import moment from 'moment-timezone';
import fs from 'fs';
import os from 'os';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../config.cjs';
import axios from 'axios';

// Get total memory and free memory in bytes
const totalMemoryBytes = os.totalmem();
const freeMemoryBytes = os.freemem();

// Define unit conversions
const byteToKB = 1 / 1024;
const byteToMB = byteToKB / 1024;
const byteToGB = byteToMB / 1024;

// Function to format bytes to a human-readable format
function formatBytes(bytes) {
  if (bytes >= Math.pow(1024, 3)) {
    return (bytes * byteToGB).toFixed(2) + ' GB';
  } else if (bytes >= Math.pow(1024, 2)) {
    return (bytes * byteToMB).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes * byteToKB).toFixed(2) + ' KB';
  } else {
    return bytes.toFixed(2) + ' bytes';
  }
}

// Bot Process Time
const uptime = process.uptime();
const day = Math.floor(uptime / (24 * 3600)); // Calculate days
const hours = Math.floor((uptime % (24 * 3600)) / 3600); // Calculate hours
const minutes = Math.floor((uptime % 3600) / 60); // Calculate minutes
const seconds = Math.floor(uptime % 60); // Calculate seconds

// Uptime
const uptimeMessage = `*I am alive now since ${day}d ${hours}h ${minutes}m ${seconds}s*`;
const runMessage = `*☀️ ${day} Day*\n*🕐 ${hours} Hour*\n*⏰ ${minutes} Minutes*\n*⏱️ ${seconds} Seconds*\n`;

const xtime = moment.tz("Africa/Nairobi").format("HH:mm:ss");
const xdate = moment.tz("Africa/Nairobi").format("DD/MM/YYYY");
const time2 = moment().tz("Africa/Nairobi").format("HH:mm:ss");
let pushwish = "";

if (time2 < "05:00:00") {
  pushwish = `Good Morning 🌄`;
} else if (time2 < "11:00:00") {
  pushwish = `Good Morning 🌄`;
} else if (time2 < "15:00:00") {
  pushwish = `Good Afternoon 🌅`;
} else if (time2 < "18:00:00") {
  pushwish = `Good Evening 🌃`;
} else if (time2 < "19:00:00") {
  pushwish = `Good Evening 🌃`;
} else {
  pushwish = `Good Night 🌌`;
}

const menu = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const mode = config.MODE === 'public' ? 'public' : 'private';
  const pref = config.PREFIX;

  const validCommands = ['list', 'help', 'menu'];

  if (validCommands.includes(cmd)) {
    const mainMenu = `
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 ${config.BOT_NAME.toUpperCase()} - ${menuTitle} 〙✪══⊷❍
║👑 ➺ 𝙊𝙒𝙉𝙀𝙍 : ${config.OWNER_NAME}
║👤 ➺ 𝙐𝙎𝙀𝙍 : ${m.pushName}
║🔑 ➺ 𝙋𝙍𝙀𝙁𝙄𝙓 : [ ${prefix} ]
║🚀 ➺ 𝙑𝙀𝙍𝙎𝙄𝙊𝙉 : 3.1.0
║🛠️ ➺ 𝘿𝙀𝙑 : 𝘿𝘼𝙍𝙆_𝙂𝘼𝙈𝙀𝙍
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

> ${pushwish} *${m.pushName}*!
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 🎮𝙂𝘼𝙈𝙀𝙍 𝙈𝙀𝙉𝙐🎮 〙✪══⊷❍
║🎧 ➺ 1. 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙈𝙀𝙉𝙐
║🔧 ➺ 2. 𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙀𝙍 𝙈𝙀𝙉𝙐
║🤖 ➺ 3. 𝘼𝙄 𝙈𝙀𝙉𝙐
║🛠️ ➺ 4. 𝙏𝙊𝙊𝙇𝙎 𝙈𝙀𝙉𝙐
║👥 ➺ 5. 𝙂𝙍𝙊𝙐𝙋 𝙈𝙀𝙉𝙐
║🔎 ➺ 6. 𝙎𝙀𝘼𝙍𝘾𝙃 𝙈𝙀𝙉𝙐
║⚡ ➺ 7. 𝙈𝘼𝙄𝙉 𝙈𝙀𝙉𝙐
║👑 ➺ 8. 𝙊𝙒𝙉𝙀𝙍 𝙈𝙀𝙉𝙐
║🕵️ ➺ 9. 𝙎𝙏𝘼𝙇𝙆 𝙈𝙀𝙉𝙐
║🔄 ➺ 𝙐𝙋𝘿𝘼𝙏𝙀
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
> *Reply with the number (1-9)*`;

    // Function to get menu image
    const getMenuImage = async () => {
      if (config.MENU_IMAGE && config.MENU_IMAGE.trim() !== '') {
        try {
          const response = await axios.get(config.MENU_IMAGE, { responseType: 'arraybuffer' });
          return Buffer.from(response.data, 'binary');
        } catch (error) {
          console.error('Error fetching menu image from URL, falling back to local image:', error);
          return fs.readFileSync('https://files.catbox.moe/zzne7x.jpeg');
        }
      } else {
        return fs.readFileSync('https://files.catbox.moe/zzne7x.jpeg');
      }
    };

    const menuImage = await getMenuImage();

    const sentMessage = await Matrix.sendMessage(m.from, {
      image: menuImage,
      caption: mainMenu,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363397722863547@newsletter',
          newsletterName: "DARK GAMER 
          serverMessageId: 143
        }
      }
    }, {
      quoted: m
    });

    // Send audio after sending the menu
    await Matrix.sendMessage(m.from, {
      audio: { url: 'https://files.catbox.moe/aklxep.mp3' },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m });

    // Set up listener for menu selection
    Matrix.ev.on('messages.upsert', async (event) => {
      const receivedMessage = event.messages[0];
      if (!receivedMessage?.message?.extendedTextMessage) return;

      const receivedText = receivedMessage.message.extendedTextMessage.text.trim();
      if (receivedMessage.message.extendedTextMessage.contextInfo?.stanzaId !== sentMessage.key.id) return;

      let menuResponse;
      let menuTitle;
      
      switch (receivedText) {
        case "1":
          menuTitle = "Download Menu";
          menuResponse = `
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙈𝙀𝙉𝙐 〙✪══⊷❍
║📦 ➺ 𝘼𝙋𝙆
║📥 ➺ 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 
║📂 ➺ 𝙈𝙀𝘿𝙄𝘼𝙁𝙄𝙍𝙀  
║📌 ➺ 𝙋𝙄𝙉𝙏𝙀𝙍𝙀𝙎𝙏
║💾 ➺ 𝙂𝙄𝙏𝘾𝙇𝙊𝙉𝙀 
║🚀 ➺ 𝙂𝘿𝙍𝙄𝙑𝙀 
║📸 ➺ 𝙄𝙉𝙎𝙏𝘼 
║🎵 ➺ 𝙔𝙏𝙈𝙋𝟯 
║🎥 ➺ 𝙔𝙏𝙈𝙋𝟰 
║🔍 ➺ 𝙋𝙇𝘼𝙔 
║🎶 ➺ 𝙎𝙊𝙉𝙂 
║📹 ➺ 𝙑𝙄𝘿𝙀𝙊 
║📄 ➺ 𝙔𝙏𝙈𝙋𝟯𝘿𝙊𝘾 
║📁 ➺ 𝙔𝙏𝙈𝙋𝟰𝘿𝙊𝘾 
║🎬 ➺ 𝙏𝙄𝙆𝙏𝙊𝙆 
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`;
         break;
          
        case "2":
          menuTitle = "Converter menu";
          menuResponse = `  
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙀𝙍 𝙈𝙀𝙉𝙐 〙✪══⊷❍
║✨ ➺ 𝘼𝙏𝙏𝙋 
║🎨 ➺ 𝘼𝙏𝙏𝙋𝟮 
║💫 ➺ 𝘼𝙏𝙏𝙋𝟯 
║🔢 ➺ 𝙀𝘽𝙄𝙉𝘼𝙍𝙔 
║🔣 ➺ 𝘿𝘽𝙄𝙉𝘼𝙍𝙔 
║🎭 ➺ 𝙀𝙈𝙊𝙅𝙄𝙈𝙄𝙓 
║🎶 ➺ 𝙈𝙋𝟯 
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`;
          break;
          
        case "3":
          menuTitle = "AI Menu";
          menuResponse = `
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 𝘼𝙍𝙏𝙄𝙁𝙄𝘾𝙄𝘼𝙇 𝙄𝙉𝙏𝙀𝙇𝙇𝙄𝙂𝙀𝙉𝘾𝙀 〙✪══⊷❍
║🧠 ➺ 𝘼𝙄 
║🛠️ ➺ 𝘽𝙐𝙂 
║📝 ➺ 𝙍𝙀𝙋𝙊𝙍𝙏 
║🤖 ➺ 𝙂𝙋𝙏 
║🎨 ➺ 𝘿𝘼𝙇𝙇𝙀 
║✨ ➺ 𝙍𝙀𝙈𝙄𝙉𝙄 
║💎 ➺ 𝙂𝙀𝙈𝙄𝙉𝙄 
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`;
          break;
          
        case "4":
          menuTitle = "Tools Menu";
          menuResponse = `
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 𝙏𝙊𝙊𝙇𝙎 𝙈𝙀𝙉𝙐 〙✪══⊷❍
║🧮 ➺ 𝘾𝘼𝙇𝘾𝙐𝙇𝘼𝙏𝙊𝙍 
║📧 ➺ 𝙏𝙀𝙈𝙋𝙈𝘼𝙄𝙇 
║📨 ➺ 𝘾𝙃𝙀𝘾𝙆𝙈𝘼𝙄𝙇 
║🌐 ➺ 𝙏𝙍𝙏 
║🔊 ➺ 𝙏𝙏𝙎 
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`;
          break;
          
        case "5":
          menuTitle = "Group Menu";
          menuResponse = `
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 𝙂𝙍𝙊𝙐𝙋 𝙈𝘼𝙉𝘼𝙂𝙀𝙈𝙀𝙉𝙏 〙✪══⊷❍
║🔗 ➺ 𝙇𝙄𝙉𝙆𝙂𝘾 
║🖼️ ➺ 𝙎𝙀𝙏𝙋𝙋𝙂𝘾 
║📛 ➺ 𝙎𝙀𝙏𝙉𝘼𝙈𝙀 
║📝 ➺ 𝙎𝙀𝙏𝘿𝙀𝙎𝘾 
║👥 ➺ 𝙂𝙍𝙊𝙐𝙋 
║⚙️ ➺ 𝙂𝘾𝙎𝙀𝙏𝙏𝙄𝙉𝙂 
║🎉 ➺ 𝙒𝙀𝙇𝘾𝙊𝙈𝙀 
║➕ ➺ 𝘼𝘿𝘿 
║🚫 ➺ 𝙆𝙄𝘾𝙆 
║💥 ➺ 𝙆𝙄𝘾𝙆𝘼𝙇𝙇 
║👑 ➺ 𝙋𝙍𝙊𝙈𝙊𝙏𝙀 
║🌟 ➺ 𝙋𝙍𝙊𝙈𝙊𝙏𝙀𝘼𝙇𝙇 
║⬇️ ➺ 𝘿𝙀𝙈𝙊𝙏𝙀 
║🔻 ➺ 𝘿𝙀𝙈𝙊𝙏𝙀𝘼𝙇𝙇 
║👻 ➺ 𝙃𝙄𝘿𝙀𝙏𝘼𝙂 
║🏷️ ➺ 𝙏𝘼𝙂𝘼𝙇𝙇 
║🛡️ ➺ 𝘼𝙉𝙏𝙄𝙇𝙄𝙉𝙆 
║⚠️ ➺ 𝘼𝙉𝙏𝙄𝙏𝙊𝙓𝙄𝘾 
║👤 ➺ 𝙂𝙀𝙏𝘽𝙄𝙊 
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`;
          break;
          
        case "6":
          menuTitle = "Search Menu";
          menuResponse = `
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 𝙎𝙀𝘼𝙍𝘾𝙃 𝙀𝙉𝙂𝙄𝙉𝙀𝙎 〙✪══⊷❍
║🎵 ➺ 𝙋𝙇𝘼𝙔 
║📺 ➺ 𝙔𝙏𝙎 
║🎬 ➺ 𝙄𝙈𝘿𝘽 
║🌐 ➺ 𝙂𝙊𝙊𝙂𝙇𝙀 
║🖼️ ➺ 𝙂𝙄𝙈𝘼𝙂𝙀 
║📌 ➺ 𝙋𝙄𝙉𝙏𝙀𝙍𝙀𝙎𝙏 
║🎨 ➺ 𝙒𝘼𝙇𝙇𝙋𝘼𝙋𝙀𝙍 
║📚 ➺ 𝙒𝙄𝙆𝙄𝙈𝙀𝘿𝙄𝘼 
║🔎 ➺ 𝙔𝙏𝙎𝙀𝘼𝙍𝘾𝙃 
║🔔 ➺ 𝙍𝙄𝙉𝙂𝙏𝙊𝙉𝙀 
║📝 ➺ 𝙇𝙔𝙍𝙄𝘾𝙎 
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`;
          break;
          
        case "7":
          menuTitle = "Main Menu";
          menuResponse = `
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 ⚡ 𝙈𝘼𝙄𝙉 𝙈𝙀𝙉𝙐 〙✪══⊷❍
║🏓 ➺ 𝙋𝙄𝙉𝙂 » 
║💡 ➺ 𝘼𝙇𝙄𝙑𝙀 
║👑 ➺ 𝙊𝙒𝙉𝙀𝙍 
║📜 ➺ 𝙈𝙀𝙉𝙐 
║📊 ➺ 𝙄𝙉𝙁𝙊𝘽𝙊𝙏 
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`;
          break;
          
        case "8":
          menuTitle = "Owner Menu";
          menuResponse = `
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 𝘽𝙊𝙏 𝘾𝙊𝙉𝙏𝙍𝙊𝙇𝙎 〙✪══⊷❍
║🚪 ➺ 𝙅𝙊𝙄𝙉 
║🏃 ➺ 𝙇𝙀𝘼𝙑𝙀 
║🚫 ➺ 𝘽𝙇𝙊𝘾𝙆 
║✅ ➺ 𝙐𝙉𝘽𝙇𝙊𝘾𝙆 
║🖼️ ➺ 𝙎𝙀𝙏𝙋𝙋𝘽𝙊𝙏 
║📵 ➺ 𝘼𝙉𝙏𝙄𝘾𝘼𝙇𝙇 
║📝 ➺ 𝙎𝙀𝙏𝙎𝙏𝘼𝙏𝙐𝙎 
║🔤 ➺ 𝙎𝙀𝙏𝙉𝘼𝙈𝙀𝘽𝙊𝙏 
║⌨️ ➺ 𝘼𝙐𝙏𝙊𝙏𝙔𝙋𝙄𝙉𝙂 
║🌐 ➺ 𝘼𝙇𝙒𝘼𝙔𝙎𝙊𝙉𝙇𝙄𝙉𝙀 
║👁️ ➺ 𝘼𝙐𝙏𝙊𝙍𝙀𝘼𝘿 
║📤 ➺ 𝘼𝙐𝙏𝙊𝙎𝙑𝙄𝙀𝙒 
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`;
          break;
          
        case "9":
          menuTitle = "Stalk Menu";
          menuResponse = `
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 𝙎𝙏𝘼𝙇𝙆 𝙈𝙀𝙉𝙐 〙✪══⊷❍
║📱 ➺ 𝙏𝙍𝙐𝙀𝘾𝘼𝙇𝙇𝙀𝙍 
║📸 ➺ 𝙄𝙉𝙎𝙏𝘼𝙎𝙏𝘼𝙇𝙆 
║💻 ➺ 𝙂𝙄𝙏𝙃𝙐𝘽𝙎𝙏𝘼𝙇𝙆 
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`;
          break;
          
        default:
          menuTitle = "Invalid Choice";
          menuResponse = "*Invalid Reply Please Reply With A Number Between 1 to 9*";
      }

      // Format the full response with title and description
      const fullResponse = `
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 ${config.BOT_NAME} - ${menuTitle} 〙✪══⊷❍
║👑 ➺ 𝙊𝙒𝙉𝙀𝙍 : ${config.OWNER_NAME}
║👤 ➺ 𝙐𝙎𝙀𝙍 : ${m.pushName}
║🔑 ➺ 𝙋𝙍𝙀𝙁𝙄𝙓 : [ ${prefix} ]
║🚀 ➺ 𝙑𝙀𝙍𝙎𝙄𝙊𝙉 : 3.1.0
║🛠️ ➺ 𝘿𝙀𝙑 : 𝘿𝘼𝙍𝙆_𝙂𝘼𝙈𝙀𝙍
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

${menuResponse}

> *${config.DESCRIPTION}*`;

      // Send the response with image and context info
      await Matrix.sendMessage(m.from, {
        image: menuImage,
        caption: fullResponse,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363397722863547@newsletter',
            newsletterName: "DARK GAMER",
            serverMessageId: 143
          }
        }
      }, {
        quoted: receivedMessage
      });
    });
  }
};

export default menu;
