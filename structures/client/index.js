const { Client, Collection, Intents } = require("discord.js");
const { QuickDB } = require("quick.db");
const fs = require("fs");

global.print = console.log;

class bot extends Client {
    constructor(options = {
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_BANS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            Intents.FLAGS.GUILD_INVITES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.GUILD_WEBHOOKS,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
        ]
    }) {

        super(options);

        this.setMaxListeners(15);

        this.db = new QuickDB();
        this.commands = new Collection();
        this.aliases = new Collection();
        this.snipe = new Collection();

        this.color = "#1519f0";
        this.footer = "© SupremeBot | BotifyHost - Made By BNT Feujjj";
        this.link = "https://discord.gg/Udq7PrZGvR";
        this.dev = "BNT Feujjj";
        this.staff = ["876126492604641370"];

        this.config = require("../../config");
        this.version = require("../../version.json").version;

        console.log("🔄 Chargement du bot...");

        this.loadCommands();
        this.loadEvents();

        this.once("ready", () => {
            console.log(`✅ Bot connecté : ${this.user.tag}`);
        });

        if (!process.env.TOKEN) {
            console.error("❌ TOKEN manquant dans les variables d'environnement");
            process.exit();
        }

        this.login(process.env.TOKEN);
    }

    async loadCommands() {

        const subFolders = fs.readdirSync("./commands");

        for (const category of subFolders) {

            const commandFiles = fs
                .readdirSync(`./commands/${category}`)
                .filter(file => file.endsWith(".js"));

            for (const file of commandFiles) {

                try {

                    const command = require(`../../commands/${category}/${file}`);

                    this.commands.set(command.name, command);

                    if (command.aliases) {
                        command.aliases.forEach(alias =>
                            this.aliases.set(alias, command)
                        );
                    }

                } catch (err) {
                    console.error(`❌ Erreur commande ${file}`, err);
                }
            }
        }

        console.log(`✅ ${this.commands.size} commandes chargées`);
    }

    loadEvents() {

        const subFolders = fs.readdirSync("./events");

        for (const category of subFolders) {

            const eventFiles = fs
                .readdirSync(`./events/${category}`)
                .filter(file => file.endsWith(".js"));

            for (const file of eventFiles) {

                try {

                    const event = require(`../../events/${category}/${file}`);

                    this.on(event.name, (...args) =>
                        event.run(this, ...args)
                    );

                } catch (err) {
                    console.error(`❌ Erreur event ${file}`, err);
                }
            }
        }

        console.log("✅ Events chargés");
    }
}

module.exports = { bot };
