import Command from "../../main/Command";
import { Message } from "discord.js";
import Plex from "../../main/Plex";
import * as Errors from "../../main/Errors";
import { GuildMember } from "discord.js";
import { MessageEmbed } from "discord.js";
import axios from "axios";
import parse from "parse-duration";
/**
 * @extends Command
 */
module.exports = class extends Command {
    client: Plex;
    constructor(client: Plex) {
        super(client, {
            name: "unmute",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Unmutes a member",
            usage: "!unmute <user>",
            examples: "!unmute 20min Mork#1586 new game",
            aliases: ["unsilence", "um"],
            botPermissions: ["MANAGE_CHANNELS"],
            memberPermissions: ["MANAGE_MESSAGES"],
            nsfw: false,
            cooldown: 1000,
        });
    }
    async run(message: Message, args: string[], data) {
        if (!args[0]) throw new Errors.MissingMention(message, 1, "Member to unmute");
        const mentioned: GuildMember | null = await this.client.resolveMember({
            guild: message.guild,
            search: args[0],
        });
        if (!mentioned) throw new Errors.InvalidMention(message, 1, "Member to be warned");

        const warnerHighestRole = message.member.roles.highest.position;
        const warnedHighestRole = mentioned.roles.highest.position;
        if (warnedHighestRole >= warnerHighestRole)
            throw new Errors.CommandError(
                message,
                "You cant unmute them because you are either below or equal hereditary to them."
            );

        const mentionedData = await this.client.findOrCreateMember({
            id: mentioned.id,
            guildID: mentioned.guild.id,
        });

        if (!mentionedData.mute.muted) return message.reply("They are not muted!");

        const dm = new MessageEmbed()
            .setColor(data.guild.embedColor)
            .setDescription("You have been successfully unmuted in " + message.guild.name)
            .setFooter(this.client.version)
            .setTimestamp();

        await mentioned.send(dm).catch();
        message.guild.channels.cache.forEach((channel) => {
            const permOverwrites = channel.permissionOverwrites.get(mentioned.id);
            if (permOverwrites) permOverwrites.delete();
        });
        mentionedData.mute = {
            muted: false,
            case: null,
            endDate: null,
        };
        const result = new MessageEmbed()
            .setColor(data.guild.embedColor)
            .setDescription("Unmuted the user")
            .setFooter(this.client.version)
            .setTimestamp();
        if (data.guild.modResult) await message.channel.send(result);

        await axios({
            url: `http://localhost:${process.env.PORT || 3000}/member`,
            method: "put",
            params: {
                id: message.author.id,
                guildID: message.guild.id,
            },
            data: mentionedData,
        });
    }
};
