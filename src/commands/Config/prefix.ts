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
            name: "prefix",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Set the prefix with the set arg, or see the prefix with no args",
            usage: "[prefix]",
            examples: "prefix !",
            aliases: ["px"],
            botPermissions: ["ADD_REACTIONS", "SEND_MESSAGES", "USE_EXTERNAL_EMOJIS"],
            memberPermissions: ["ADMINISTRATOR"],
            nsfw: false,
            cooldown: 3000,
        });
    }
    async run(message: Message, args: [string], data) {
        if (!args[0]) {
            return await message.channel.send("My Prefix is " + data.guild.prefix);
        }
        if (args[0].length > 2)
            throw new Error.InvalidArg(message, 1, "A 1 or 2 letter prefix for me!");
        data.guild.prefix = args[0];
        const request = await axios({
            url: `http://localhost:${process.env.PORT || 3000}/guild`,
            method: "put",
            params: {
                id: message.guild.id,
            },
            data: data.guild,
        });
        if (request.status === 200) return await message.react(this.client.config.emojis.check);
        if (request.status === 404) {
            await axios({
                url: `http://localhost:${process.env.PORT || 3000}/guild`,
                method: "post",
                params: {
                    id: message.guild.id,
                },
            });
            const newReq = await axios({
                url: `http://localhost:${process.env.PORT || 3000}/guild`,
                method: "put",
                params: {
                    id: message.guild.id,
                },
                data: data.guild,
            });
            if (newReq.status !== 200) {
                await message.react(this.client.config.emojis.error);
                return await message.channel
                    .send(
                        "Hmm something went wrong, please try again later! If the problem persist, please create a issue at https://github.com/carterdacat/Plex"
                    )
                    .then((m) => m.delete({ timeout: 5000 }));
            }
        }
    }
};
