import Plex from "../main/Plex";
import { Message, MessageEmbed, TextChannel } from "discord.js";

module.exports = class {
    client: Plex;
    constructor(client: Plex) {
        this.client = client;
    }
    async run(message: Message) {
        const gData = await this.client.findOrCreateGuild({ id: message.member.guild.id });
        const mData = await this.client.findOrCreateMember({
            id: message.member.id,
            guildID: message.member.guild.id,
        });
        const uData = await this.client.findOrCreateUser({ id: message.member.id });
        if (!mData || !gData || !uData) return;
        const required = 5 * (mData.level * mData.level) + 80 * mData.level + 100;
        const levelUpEmbed = new MessageEmbed();
        levelUpEmbed
            .setColor(uData.levelColor || gData.levelColor)
            .setAuthor("Level Up!", message.member.user.avatarURL({ dynamic: true }))
            .setDescription(`<@${message.member.id}>, you leveled up to level ${mData.level}!`)
            .setFooter(`${mData.exp}/${required} • ${required - mData.exp} left`)
            .setTimestamp();
        await message.channel.send(levelUpEmbed);
    }
};
