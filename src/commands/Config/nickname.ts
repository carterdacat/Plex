import Command from "../../main/Command";
import { Message } from "discord.js";
import Plex from "../../main/Plex";
import axios from "axios";
import * as Error from "../../main/Errors";
module.exports = class extends Command {
    /**
     * @param client
     */
    client: Plex;
    constructor(client: Plex) {
        super(client, {
            name: "nickname",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Set/View the bots nickname",
            usage: "[nickname]",
            examples: "!nickname Bot#1",
            aliases: ["nick"],
            botPermissions: [
                "ADD_REACTIONS",
                "SEND_MESSAGES",
                "USE_EXTERNAL_EMOJIS",
                "MANAGE_NICKNAMES",
            ],
            memberPermissions: ["ADMINISTRATOR"],
            nsfw: false,
            cooldown: 3000,
        });
    }
    async run(message: Message, args: [string], data) {
        if (!args[0]) return message.reply(`My nickname is currently ${data.guild.nickname}`);
        if (args.join(" ").length > 20)
            throw new Error.CommandError(
                message,
                "The nickname was over 20 chars long, so I can't set it"
            );
        data.guild.nickname = args.join(" ");
        await axios({
            method: "put",
            url: `http://localhost:${process.env.PORT || 3000}/guild`,
            params: {
                id: message.guild.id,
            },
            data: data.guild,
        });
        return message.reply("Ok, I set it");
    }
};
