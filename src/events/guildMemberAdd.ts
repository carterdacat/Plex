import Plex from "../main/Plex";
import { GuildMember, MessageAttachment, TextChannel } from "discord.js";
import { join } from "path";
import axios from "axios";
import { MessageEmbed } from "discord.js";

module.exports = class {
    client: Plex;

    constructor(client) {
        this.client = client;
    }
    async run(member: GuildMember) {
        const guild = await member.guild.fetch();

        const guildData = await this.client.findOrCreateGuild({ id: guild.id });

        const memberData: any = await this.client.findOrCreateMember({
            id: member.id,
            guildID: guild.id,
        });
        if (memberData.mute.muted && memberData.mute.endDate > Date.now()) {
            guild.channels.cache.forEach((channel) => {
                channel
                    .updateOverwrite(member.id, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        CONNECT: false,
                    })
                    .catch((err) => {
                        this.client.logger.log(err, "error");
                    });
            });
        }

        if (guildData.autoRole) {
            const role = await this.client.resolveRole({
                guild: member.guild,
                search: guildData.autoRole,
            });
            await member.roles.add(role);
        }

        if (guildData.welcome) {
            const welcomeChannel = await this.client.resolveChannel({
                guild: member.guild,
                search: guildData.welcome,
                channelType: TextChannel,
            });
            if (welcomeChannel) {
                const message = guildData.welcomeMessage
                    .replace(/{user}/g, member.user.tag)
                    .replace(/{server}/g, guild.name)
                    .replace(/{membercount}/g, guild.memberCount)
                    .replace(/{uMention}/g, `<@${member.id}>`)
                    .replace(/{everyone}/g, `@everyone`)
                    .replace(/{here}/, `@here`);
                const embed = new MessageEmbed();
                embed
                    .setDescription(message)
                    .setTitle(`${member.user.username} joined the server!`)
                    .setColor(guildData.embedColor)
                    .setFooter(guild.memberCount)
                    .setTimestamp();
                if (guild.bannerURL() || guild.iconURL())
                    guild.bannerURL()
                        ? embed.setImage(guild.bannerURL())
                        : embed.setImage(guild.iconURL());

                await welcomeChannel.send(embed);
            }
        }

        if (guildData.logs.join) {
            const log = await this.client.resolveChannel({
                guild: member.guild,
                search: guildData.logs.join,
                channelType: TextChannel,
            });
            if (log) {
                const embed = new MessageEmbed()
                    .setTitle("Member Joined")
                    .setDescription(
                        `<@${member.user.id}> joined the server. You now have ${guild.memberCount} members.`
                    )
                    .setAuthor(member.user.tag, member.user.displayAvatarURL())
                    .setFooter(member.user.id)
                    .setTimestamp()
                    .setColor(guildData.embedColor);

                await log.send(embed);
            }
        }
    }
};
