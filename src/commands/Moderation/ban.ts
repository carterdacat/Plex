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
            name: "ban",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Bans a member",
            usage: "!ban <user> <reason>",
            examples: "!ban Mork#1586 voted out by the council of elders",
            aliases: ["banish"],
            botPermissions: ["BAN_MEMBERS"],
            memberPermissions: ["BAN_MEMBERS"],
            nsfw: false,
            cooldown: 1000,
        });
    }
    async run(message: Message, args: string[], data) {
        if (!args[0]) {
            throw new Errors.MissingMention(message, 1, "Member to be banned");
        }
        const mentioned: GuildMember = await this.client.resolveMember({
            guild: message.guild,
            search: args[0],
        });
        if (!mentioned) {
            if (args[0].length === 18 || /(<@!?)(\d){18}(>)/g.test(args[0])) {
                if (args[0].length === 18) {
                    const reason = args[1] ? args.splice(1).join(" ") : null;
                    const banedEmbed = new MessageEmbed()
                        .setTitle("Member Banned")
                        .setAuthor(message.guild.name, message.guild.iconURL())
                        .setDescription(
                            `<@${args[0]}> was banned, ${
                                reason ? "for reason `" + reason + "`" : "with out reason"
                            }`
                        )
                        .setFooter("Case #" + (data.guild.modlogs.length + 1))
                        .setTimestamp();
                    await message.channel.send(banedEmbed);
                    return await message.guild.members.ban(args[0], { reason: reason });
                }
                if (/(<@)(\d){18}(>)/g.test(args[0])) {
                    const nMessage = args[0].slice(2, 20);
                    const reason = args[1] ? args.splice(1).join(" ") : null;
                    const banedEmbed = new MessageEmbed()
                        .setTitle("Member Banned")
                        .setAuthor(message.guild.name, message.guild.iconURL())
                        .setDescription(
                            `<@${nMessage}> was banned, ${
                                reason ? "for reason `" + reason + "`" : "with out reason"
                            }`
                        )
                        .setFooter("Case #" + (data.guild.modlogs.length + 1))
                        .setTimestamp()
                        .setColor(data.guild.embedColor);
                    await message.channel.send(banedEmbed);
                    return await message.guild.members.ban(nMessage, { reason: reason });
                }
                const nMessage = args[0].slice(3, 21);
                const reason = args[1] ? args.splice(1).join(" ") : null;
                const banedEmbed = new MessageEmbed()
                    .setTitle("Member Banned")
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription(
                        `<@${nMessage}> was banned, ${
                            reason ? "for reason `" + reason + "`" : "with out reason"
                        }`
                    )
                    .setFooter("Case #" + (data.guild.modlogs.length + 1))
                    .setTimestamp()
                    .setColor(data.guild.embedColor);
                await message.channel.send(banedEmbed);
                return await message.guild.members.ban(nMessage, { reason: reason });
            }
            throw new Errors.InvalidMention(message, 1, "Member to be banned");
        }

        const bannerHighestRole = message.member.roles.highest.position;
        const bannedHighestRole = mentioned.roles.highest.position;
        if (bannedHighestRole >= bannerHighestRole)
            throw new Errors.CommandError(
                message,
                "You cant ban them because you are either below or equal hereditary to them."
            );
        if (!mentioned.bannable)
            throw new Errors.CommandError(
                message,
                "Unable to ban as they are not bannable. This may be because they own this server, or I am a lower or equal role as them"
            );
        const reason = args[1] ? args.splice(1).join(" ") : null;
        const modlog = {
            bit: 4,
            u: mentioned.id,
            m: message.author.id,
            g: message.guild.id,
            r: reason,
            t: Date.now(),
        };
        let e;
        const embed = new MessageEmbed()
            .setTitle("Banned")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(
                `You were banned in ${message.guild.name}, ${
                    reason ? "for reason `" + reason + "`" : "with out reason"
                } `
            )
            .setFooter("Case #" + (data.guild.modlogs.length + 1))
            .setTimestamp()
            .setColor(data.guild.embedColor);
        await mentioned.send(embed).catch(() => (e = true));
        await message.guild.members.ban(mentioned.id, { reason: reason });

        const banedEmbed = new MessageEmbed()
            .setTitle("Member Banned")
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(
                `${mentioned.user.tag} was banned, ${
                    reason ? "for reason `" + reason + "`" : "with out reason"
                }. ${e ? "I was unable to dm them." : ""}`
            )
            .setFooter("Case #" + (data.guild.modlogs.length + 1))
            .setTimestamp()
            .setColor(data.guild.embedColor);
        if (data.guild.modResult) await message.channel.send(banedEmbed);

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
    //= await this.client.resolveMember()
};
