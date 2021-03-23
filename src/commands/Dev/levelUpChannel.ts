import Command from "../../main/Command";
import { Message } from "discord.js";
import Plex from "../../main/Plex";
import axios from "axios";
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
            name: "levelUpChannel",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Dev command that emeulates a levelUpChannel event",
            usage: "N/A",
            examples: "",
            aliases: [],
            botPermissions: ["ADD_REACTIONS", "SEND_MESSAGES", "USE_EXTERNAL_EMOJIS"],
            memberPermissions: ["ADMINISTRATOR"],
            nsfw: false,
            cooldown: 3000,
        });
    }

    async run(message: Message, args: [string], data) {
        this.client.emit("levelUpChannel", message.member);
    }
};
