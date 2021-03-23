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
            name: "mute",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Mutes a member",
            usage: "!mute <user> <reason|time> [reason]",
            examples: "!mute 20min Mork#1586 to loud",
            aliases: ["silence"],
            botPermissions: ["MANAGE_CHANNELS"],
            memberPermissions: ["MANAGE_MESSAGES"],
            nsfw: false,
            cooldown: 1000,
        });
    }
    async run(message: Message, args: string[], data) {
        if (!args[0]) throw new Errors.MissingMention(message, 1, "Member to mute");
        const mentioned: GuildMember | null = await this.client.resolveMember({
            guild: message.guild,
            search: args[0],
        });
        if (!mentioned) throw new Errors.InvalidMention(message, 1, "Member to be mute");

        const kickerHighestRole = message.member.roles.highest.position;
        const kickedHighestRole = mentioned.roles.highest.position;
        if (kickedHighestRole >= kickerHighestRole)
            throw new Errors.CommandError(
                message,
                "You cant mute them because you are either below or equal hereditary to them."
            );
        const muteEndTS = parse(args[1]) ? parse(args[1]) + Date.now() : null;
        console.log(args)
        let reason;
        reason = args[2] && muteEndTS ? args.splice(1).splice(1).join(" ") : reason;
        reason = args[1] && !muteEndTS ? args.splice(1).join(" ") : reason;
        const modlog = {
            bit: 2,
            u: mentioned.id,
            m: message.author.id,
            g: message.guild.id,
            r: reason,
            t: Date.now(),
            et: muteEndTS,
        };
        const mentionedData = await this.client.findOrCreateMember({
            id: mentioned.id,
            guildID: mentioned.guild.id,
        });
        mentionedData.mute = {
            muted: true,
            case: data.guild.modlogs.length + 1,
            endDate: muteEndTS,
        };
        message.guild.channels.cache.forEach((channel) => {
            if (!channel.permissionsFor(this.client.user).has("VIEW_CHANNEL")) return;
            channel
                .updateOverwrite(mentioned.id, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CONNECT: false,
                })
                .catch();
        });
        this.client.muted.set(`${mentioned.id}${message.guild.id}`, mentionedData);

        const dm = new MessageEmbed()
            .setTitle("Muted")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor(data.guild.embedColor)
            .setDescription(
                `You where muted in ${message.guild.name}, ${
                    reason ? "for reason `" + reason + "`" : "with out reason"
                }`
            )
            .setFooter(
                "Case #" + `${data.guild.modlogs.length++}` + (muteEndTS ? " • Muted until" : "")
            )
            .setTimestamp(muteEndTS);

        let e;
        await mentioned.send(dm).catch(() => (e = true));

        const result = new MessageEmbed()
            .setTitle("Member Muted")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(
                `${mentioned.user.tag} was muted, ${
                    reason ? "for reason `" + reason + "`" : "with out a reason"
                }. ${e ? "I was unable to dm them." : ""}`
            )
            .setFooter(
                "Case #" + (data.guild.modlogs.length + 1) + (muteEndTS ? " • Muted until" : "")
            )
            .setTimestamp(muteEndTS)
            .setColor(data.guild.embedColor);
        if (data.guild.modResult) await message.channel.send(result);

        await axios({
            url: `http://localhost:${process.env.PORT || 3000}/guild`,
            method: "put",
            params: {
                id: message.guild.id,
            },
            data: data.guild,
        });

        await axios({
            url: `http://localhost:${process.env.PORT || 3000}/member`,
            method: "put",
            params: {
                id: mentioned.id,
                guildID: mentioned.guild.id,
            },
            data: mentionedData,
        });
    }
};
