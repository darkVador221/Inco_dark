import dotenv from 'dotenv';
dotenv.config();

import {
    makeWASocket,
    Browsers,
    fetchLatestBaileysVersion,
    DisconnectReason,
    useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Handler, Callupdate, GroupUpdate } from './data/index.js';
import express from 'express';
import pino from 'pino';
import fs from 'fs';
import { File } from 'megajs';
import NodeCache from 'node-cache';
import path from 'path';
import chalk from 'chalk';
import moment from 'moment-timezone';
import axios from 'axios';
import config from './config.cjs';
import pkg from './lib/autoreact.cjs';

const { emojis, doReact } = pkg;
const prefix = process.env.PREFIX || config.PREFIX;
const sessionName = "session";
const app = express();
const orange = chalk.bold.hex("#FFA500");
const lime = chalk.bold.hex("#32CD32");
let useQR = false;
let initialConnection = true;
const PORT = process.env.PORT || 3000;

const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function downloadSessionData() {
    console.log("Debugging SESSION_ID:", config.SESSION_ID);

    if (!config.SESSION_ID) {
        console.error('❌ Please add your session to SESSION_ID env !!');
        return false;
    }

    const sessdata = config.SESSION_ID.split("GAMER~XMD~")[1];

    if (!sessdata || !sessdata.includes("#")) {
        console.error('❌ Invalid SESSION_ID format! It must contain both file ID and decryption key.');
        return false;
    }

    const [fileID, decryptKey] = sessdata.split("#");

    try {
        console.log("🔄 Downloading Session...");
        const file = File.fromURL(`https://mega.nz/file/${fileID}#${decryptKey}`);

        const data = await new Promise((resolve, reject) => {
            file.download((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        await fs.promises.writeFile(credsPath, data);
        console.log("🔒 Session Successfully Loaded !!");
        return true;
    } catch (error) {
        console.error('❌ Failed to download session data:', error);
        return false;
    }
}

async function start() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`🤖 GAMER-XMD using WA v${version.join('.')}, isLatest: ${isLatest}`);
        
        const sock = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: useQR,
            browser: ["GAMER-XMD", "Safari", "3.3"],
            auth: state,
            getMessage: async (key) => {
                return { conversation: "GAMER-XMD WhatsApp Bot" };
            }
        });

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                    start();
                }
            } else if (connection === 'open') {
                if (initialConnection) {
                    console.log(chalk.green("✅ Connected Successfully to GAMER-XMD!"));
                    sock.sendMessage(sock.user.id, { 
                        image: { url: "https://files.catbox.moe/zzne7x.jpeg" }, 
                        caption: `╓─────────────────────────────╖
┃     𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗚𝗔𝗠𝗘𝗥–𝗫𝗠𝗗 🤖
╙─────────────────────────────╜

👤 *Hello, welcome!*

━━━━━━━━━━━━━━━━━━━━━━
📢 *Channel WhatsApp* :
https://whatsapp.com/channel/0029VbAF9iTJUM2aPl9plJ2U

💻 *Repository* :
https://github.com/darkVador221/Inco_dark
━━━━━━━━━━━━━━━━━━━━━━

⚡ *Prefix* : ${prefix}
🔒 *Session active. Don't share it!*

─ Powered by DARK GAMER ⚔`
                    });
                    initialConnection = false;
                } else {
                    console.log(chalk.blue("♻️ Reconnected to WhatsApp"));
                }
            }
        });

        sock.ev.on('creds.update', saveCreds);
        sock.ev.on("messages.upsert", async chatUpdate => await Handler(chatUpdate, sock, logger));
        sock.ev.on("call", async json => await Callupdate(json, sock));
        sock.ev.on("group-participants.update", async msg => await GroupUpdate(sock, msg));

        if (config.MODE === "public") {
            sock.public = true;
        } else {
            sock.public = false;
        }

        sock.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                if (!mek.key.fromMe && config.AUTO_REACT && mek.message) {
                    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                    await doReact(randomEmoji, mek, sock);
                }
            } catch (err) {
                console.error('Auto-reaction error:', err);
            }
        });

        sock.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                const fromJid = mek.key.participant || mek.key.remoteJid;
                if (!mek || !mek.message || mek.key.fromMe) return;
                if (mek.message.protocolMessage || mek.message.ephemeralMessage || mek.message.reactionMessage) return;
                if (mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN) {
                    await sock.readMessages([mek.key]);
                    if (config.AUTO_STATUS_REPLY) {
                        const msg = config.STATUS_READ_MSG || '👀 Status vu par GAMER-XMD';
                        await sock.sendMessage(fromJid, { text: msg }, { quoted: mek });
                    }
                }
            } catch (err) {
                console.error('Status seen error:', err);
            }
        });

    } catch (error) {
        console.error('🚨 Fatal bot error:', error);
        process.exit(1);
    }
}

async function init() {
    if (fs.existsSync(credsPath)) {
        console.log("🟢 Session creds found — starting without QR.");
        await start();
    } else {
        const sessionDownloaded = await downloadSessionData();
        if (sessionDownloaded) {
            console.log("🟢 Session loaded from MEGA — starting bot.");
            await start();
        } else {
            console.log("🟡 No session — QR code will be printed.");
            useQR = true;
            await start();
        }
    }
}

init();

app.get('/', (req, res) => {
    res.send('🟢 GAMER-XMD Bot is Live');
});

app.listen(PORT, () => {
    console.log(`🚀 GAMER-XMD server running on port ${PORT}`);
});