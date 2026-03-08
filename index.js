const { Client, GatewayIntentBits } = require("discord.js");
const { QuickDB } = require("quick.db");

const db = new QuickDB();

class bot extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.prefix = "&";

        this.start();
    }

    async start() {

        try {
            const prefix = await db.get("mainprefix");
            if(prefix) this.prefix = prefix;
        } catch(e) {
            console.log("Erreur DB :", e);
        }

        this.on("ready", () => {
            console.log(`✅ Bot connecté : ${this.user.tag}`);
        });

        this.login(process.env.TOKEN);
    }
}

module.exports = { bot };
