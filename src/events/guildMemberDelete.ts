import Plex from "../main/Plex";
import { MessageEmbed, TextChannel, GuildMember } from "discord.js";

module.exports = class {
    client: Plex;
    constructor(client: Plex) {
        this.client = client;
    }

    async run(member: GuildMember) {
        const guild = await member.guild.fetch();

        const guildData = await this.client.findOrCreateGuild({ id: guild.id });

        const memberData: any = await this.client.findOrCreateMember({
            id: member.id,
            guildID: guild.id,
        });

        if (guildData.goodbye) {
            const leaveChannel = await this.client.resolveChannel({
                guild: member.guild,
                search: guildData.welcome,
                channelType: TextChannel,
            });
            if (leaveChannel) {
                const message = guildData.goodbyeMessage
                    .replace(/{user}/g, member.user.tag)
                    .replace(/{server}/g, guild.name)
                    .replace(/{membercount}/g, guild.memberCount)
                    .replace(/{uMention}/g, `<@${member.id}>`)
                    .replace(/{everyone}/g, `@everyone`)
                    .replace(/{here}/, `@here`);
                const embed = new MessageEmbed();
                embed
                    .setDescription(message)
                    .setTitle(`${member.user.username} left the server!`)
                    .setColor(guildData.embedColor)
                    .setFooter(guild.memberCount)
                    .setTimestamp();
                if (guild.bannerURL() || guild.iconURL())
                    guild.bannerURL()
                        ? embed.setImage(guild.bannerURL())
                        : embed.setImage(guild.iconURL());

                await leaveChannel.send(embed);
            }
        }

        if (guildData.logs.leave) {
            const log = await this.client.resolveChannel({
                guild: member.guild,
                search: guildData.logs.leave,
                channelType: TextChannel,
            });
            if (log) {
                const embed = new MessageEmbed()
                    .setTitle("Member Left")
                    .setDescription(
                        `<@${member.user.id}> left the server. You now have ${guild.memberCount} members.`
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
