import Command from "../../main/Command";
import { Message } from "discord.js";
import Plex from "../../main/Plex";
import axios from "axios";
import * as Error from "../../main/Errors";
import { TextChannel } from "discord.js";
module.exports = class extends Command {
    /**
     * @param client
     */
    client: Plex;
    constructor(client: Plex) {
        super(client, {
            name: "ignoreChannel",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Blacklists a channel",
            usage: "[channel]",
            examples: "!ignore #no-bots",
            aliases: ["ignore-channel", "ignore_channel"],
            botPermissions: ["ADD_REACTIONS", "SEND_MESSAGES", "USE_EXTERNAL_EMOJIS"],
            memberPermissions: ["ADMINISTRATOR"],
            nsfw: false,
            cooldown: 3000,
        });
    }
    async run(message: Message, args: [string], data) {
        const channel: TextChannel = await this.client.resolveChannel({
            guild: message.guild,
            search: args[0],
            channelType: "text",
        });
        if (!channel) {
            if (data.guild.blockedChannels.length === 0)
                return await message.reply("Their are no blocked channels.");
            let listOfIds = "Current blocked channels are: ";
            data.guild.blockedChannel.forEach((element) => {
                listOfIds = listOfIds + `<#${element}>`;
            });
            return await message.channel.send(listOfIds);
        }
        data.guild.blockedChannels.push(channel.id);
        await axios({
            method: "put",
            url: `http://localhost:${process.env.PORT || 3000}/guild`,
            params: {
                id: message.guild.id,
            },
            data: data.guild,
        });
        return message.reply(`Ok, I blocked <#${channel.id}>`);
    }
};
