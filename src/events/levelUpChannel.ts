import Plex from "../main/Plex"
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";

module.exports = class {
    client: Plex
    constructor(client: Plex) {
        this.client = client
    }
    async run(member: GuildMember) {
        const gData = await this.client.findOrCreateGuild({id: member.guild.id})
        const mData = await this.client.findOrCreateMember({id: member.id, guildID: member.guild.id})
        const uData = await this.client.findOrCreateUser({id: member.id})
        if(!mData || !gData || !uData) return
        const required =  5 * (mData.level * mData.level) + 80 * mData.level + 100
        const lUpChannel = await this.client.resolveChannel(gData.levelUpChannel)
        const levelUpEmbed = new MessageEmbed()
        levelUpEmbed
            .setColor(uData.levelColor || gData.levelColor)
            .setAuthor("Level Up!", member.user.avatarURL({dynamic: true}))
            .setDescription(`<@${member.id}>, you leveled up to level ${mData.level}!`)
            .setFooter(`${mData.expl}/${required} • ${required - mData.exp} left` )
            .setTimestamp()
        await lUpChannel.send(levelUpEmbed)
    }
}
