import Command from "../../main/Command";
import { Message } from "discord.js";
import Plex from "../../main/Plex";
/**
 * Ping command, Gets ping
 * @extends Command
 */
module.exports = class extends Command {
    /**
     * @param client
     */
    client: Plex;
    constructor(client: Plex) {
        super(client, {
            name: "ping",
            dirname: __dirname,
            enabled: true,
            guildOnly: false,
            description: "Gets the ping",
            usage: "N/A",
            examples: "ping",
            aliases: [],
            botPermissions: ["SEND_MESSAGES"],
            memberPermissions: ["SEND_MESSAGES"],
            nsfw: false,
            cooldown: 3000,
        });
    }
    async run(message: Message) {
        await message.channel.send("Pinging...").then((m: Message) => {
            m.edit(
                `Pong! Bot ping: ${m.createdTimestamp - message.createdTimestamp}, API Ping: ${
                    this.client.ws.ping
                }`
            );
            this.client.logger.log(
                `Pong! Bot ping: ${m.createdTimestamp - message.createdTimestamp}, API Ping: ${
                    this.client.ws.ping
                }`,
                "log"
            );
        });
    }
};
