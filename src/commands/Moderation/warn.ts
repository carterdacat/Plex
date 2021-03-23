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
            name: "warn",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Warns a member",
            usage: "!warn <user> <reason>",
            examples: "!warn Mork#1586 flying to high",
            aliases: ["strike"],
            botPermissions: [],
            memberPermissions: ["MANAGE_MESSAGES"],
            nsfw: false,
            cooldown: 1000,
        });
    }
    async run(message: Message, args: string[], data) {
        if (!args[0]) throw new Errors.MissingMention(message, 1, "Member to warn");
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
                "You cant warn them because you are either below or equal hereditary to them."
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
            .setTitle("Warned")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor(data.guild.embedColor)
            .setFooter("Case #" + (data.guild.modlogs.length + 1))
            .setTimestamp()
            .setDescription(
                `You were warned in ${message.guild.name}, ${
                    reason ? "for reason `" + reason + "`" : "with out reason"
                }`
            );
        let e;
        await mentioned.send(dm).catch(() => (e = true));

        const result = new MessageEmbed()
            .setTitle("Member Warned")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(
                `${mentioned.user.tag} was warned, ${
                    reason ? "for reason `" + reason + "`" : "with out reason"
                }. ${e ? "I was unable to dm them." : ""}`
            )
            .setFooter("Case #" + (data.guild.modlogs.length + 1))
            .setTimestamp()
            .setColor(data.guild.embedColor);
        if (data.guild.modResult) await message.channel.send(result);

        data.guild.modlogs.push(modlog);

        const modlogsForUser = [];

        data.guild.modlogs.forEach((log) => {
            if (log.u === mentioned.id) modlogsForUser.push(log);
        });

        await axios({
            url: `http://localhost:${process.env.PORT || 3000}/guild`,
            method: "put",
            params: {
                id: message.guild.id,
            },
            data: data.guild,
        });
        let ban = false;
        if (modlogsForUser.length > data.guild.warnLimitBan) ban = true;
        if (data.guild.warnLimitKick && modlogsForUser.length > data.guild.warnLimitKick && !ban) {
            if (
                !mentioned.kickable ||
                message.member.roles.highest.comparePositionTo(mentioned.roles.highest) <= 0
            )
                return;
            const kickDM = new MessageEmbed()
                .setTitle("Kicked")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setColor(data.guild.embedColor)
                .setFooter("Case #" + (data.guild.modlogs.length + 1))
                .setTimestamp()
                .setDescription(
                    `You were kicked in ${message.guild.name}, for exceeding the warn limit. \`${modlogsForUser.length}/${data.guild.warnLimitKick}\``
                );
            await mentioned.send(kickDM).catch();
            await mentioned.kick();

            const newModlog = {
                bit: 3,
                u: mentioned.id,
                m: message.author.id,
                g: message.guild.id,
                t: Date.now(),
                r:
                    "Exceeding the warn limit." +
                    modlogsForUser.length +
                    "/" +
                    data.guild.warnLimitKick,
            };
            data.guild.modlogs.push(newModlog);
            return await axios({
                url: `http://localhost:${process.env.PORT || 3000}/guild`,
                method: "put",
                params: {
                    id: message.guild.id,
                },
                data: data.guild,
            });
        }

        if (data.guild.warnLimitBan && modlogsForUser.length > data.guild.warnLimitBan) {
            if (
                !mentioned.bannable ||
                message.member.roles.highest.comparePositionTo(mentioned.roles.highest) <= 0
            )
                return;

            const banDM = new MessageEmbed()
                .setTitle("Banned")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setColor(data.guild.embedColor)
                .setFooter("Case #" + (data.guild.modlogs.length + 1))
                .setTimestamp()
                .setDescription(
                    `You were banned in ${message.guild.name}, for exceeding the warn limit. \`${modlogsForUser.length}/${data.guild.warnLimitKick}\``
                );
            await mentioned.send(banDM).catch();
            await mentioned.ban();

            const newModlog = {
                bit: 4,
                u: mentioned.id,
                m: message.author.id,
                g: message.guild.id,
                t: Date.now(),
                r:
                    "Exceding the warn limit." +
                    modlogsForUser.length +
                    "/" +
                    data.guild.warnLimitKick,
            };
            data.guild.modlogs.push(newModlog);
            return await axios({
                url: `http://localhost:${process.env.PORT || 3000}/guild`,
                method: "put",
                params: {
                    id: message.guild.id,
                },
                data: data.guild,
            });
        }
    }
};
