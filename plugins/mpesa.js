const axios = require("axios");
const { cmd } = require("../command");


cmd({
    pattern: "mpesamenu",
    alias: ["pesa"],
    desc: "menu the bot",
    category: "menu",
    react: "🤧",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `*▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
╔═══✪〘 𝗦𝗨𝗣𝗣𝗢𝗥𝗧🫡 〙✪══⊷❍
║🤑 ➺ .ᴍᴘᴇsᴀ 
║💳 ➺ .ᴀɪʀᴛᴇʟᴍᴏɴᴇʏ 
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
                        newsletterJid: '120363382023564830@newsletter',
                        newsletterName: "GAMER-XD PAYMENT",
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
                      
