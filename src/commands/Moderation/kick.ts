import Command from "../../main/Command";
import { Message } from "discord.js";
import Plex from "../../main/Plex";
import * as Errors from "../../main/Errors";
import { GuildMember } from "discord.js";
import { MessageEmbed } from "discord.js";
import axios from "axios";
/**
 * @extends Command
 */
module.exports = class extends Command {
    client: Plex;
    constructor(client: Plex) {
        super(client, {
            name: "kick",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Kicks a member",
            usage: "!kicks <user> <reason>",
            examples: "!kick Mork#1586 to cool for school",
            aliases: [""],
            botPermissions: ["KICK_MEMBERS"],
            memberPermissions: ["KICK_MEMBERS"],
            nsfw: false,
            cooldown: 1000,
        });
    }
    async run(message: Message, args: string[], data) {
        if (!args[0]) throw new Errors.MissingMention(message, 1, "Member to kick");
        const mentioned: GuildMember | null = await this.client.resolveMember({
            guild: message.guild,
            search: args[0],
        });
        if (!mentioned) throw new Errors.InvalidMention(message, 1, "Member to be kicked");

        const kickerHighestRole = message.member.roles.highest.position;
        const kickedHighestRole = mentioned.roles.highest.position;
        if (kickedHighestRole >= kickerHighestRole)
            throw new Errors.CommandError(
                message,
                "You cant kick them because you are either below or equal hereditary to them."
            );
        const reason = args[1] ? args.splice(1).join(" ") : null;
        const modlog = {
            bit: 1,
            u: mentioned.id,
            m: message.author.id,
            g: message.guild.id,
            r: reason,
            t: Date.now(),
        };
        const dm = new MessageEmbed()
            .setTitle("Kicked")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor(data.guild.embedColor)
            .setFooter("Case #" + (data.guild.modlogs.length + 1))
            .setTimestamp()
            .setDescription(
                `You were kicked in ${message.guild.name}, ${
                    reason ? "for reason `" + reason + "`" : "with out reason"
                }`
            );
        let e;
        await mentioned.send(dm).catch(() => (e = true));
        await mentioned.kick().catch();
        const result = new MessageEmbed()
            .setTitle("Member Kicked")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(
                `${mentioned.user.tag} was kicked, ${
                    reason ? "for reason `" + reason + "`" : "with out reason"
                }. ${e ? "I was unable to dm them." : ""}`
            )
            .setFooter("Case #" + (data.guild.modlogs.length + 1))
            .setTimestamp()
            .setColor(data.guild.embedColor);
        if (data.guild.modResult) await message.channel.send(result);

        data.guild.modlogs.push(modlog);

        await axios({
            url: `http://localhost:${process.env.PORT || 3000}/guild`,
            method: "put",
            params: {
                id: message.guild.id,
            },
            data: data.guild,
        });
    }
};
