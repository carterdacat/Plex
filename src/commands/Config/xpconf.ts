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
            name: "xpconf",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Set/View the current xp setting",
            usage: "[on/off]",
            examples: "!xpc",
            aliases: ["nick"],
            botPermissions: ["ADD_REACTIONS", "SEND_MESSAGES", "USE_EXTERNAL_EMOJIS"],
            memberPermissions: ["ADMINISTRATOR"],
            nsfw: false,
            cooldown: 3000,
        });
    }
    async run(message: Message, args: [string], data) {
        if (!args[0])
            return message.reply(`Xp is currently ${data.guild.xp ? "enabled" : "disabled"}`);
        if (["on", "enable", "yes", "true"].includes(args[0])) data.guild.xp = true;
        if (["off", "disable", "no", "false"].includes(args[0])) data.guild.xp = false;
        if (
            !["off", "disable", "no", "false"].includes(args[0]) ||
            ["on", "enable", "yes", "true"].includes(args[0])
        )
            return message.reply(
                `Hmm, I can't interprit that, so I will keep it ${
                    data.guild.xp ? "enabled" : "disabled"
                }`
            );
        await axios({
            method: "put",
            url: `http://localhost:${process.env.PORT || 3000}/guild`,
            params: {
                id: message.guild.id,
            },
            data: data.guild,
        });
        message.reply(`Ok! I ${data.guild.xp ? "enabled" : "disabled"} it.`);
    }
};
