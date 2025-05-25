const axios = require("axios");
const { cmd } = require("../command");


cmd({
    pattern: "adult",
    alias: ["adultmenu"],
    desc: "menu the bot",
    category: "menu",
    react: "🎀",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `*▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 𝟭𝟴+ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 🔞 〙✪══⊷❍
║🔥 ➺ .xᴠɪᴅᴇᴏ 
║🎥 ➺ .ᴘᴏʀɴ 
║📹 ➺ .xᴠɪᴅᴇᴏs 
║🌀 ➺ .ʀᴀɴᴅᴏᴍᴘᴏʀɴ 
║🎬 ➺ .ʀᴀɴᴅᴘᴍxᴠɪᴅᴇᴏ 
╚══════════════════⊷❍
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/zzne7x.jpeg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363397722863547@newsletter',
                        newsletterName: "GAMER-XMD ADULT MENU🔞🔞₊",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
