import Plex from "../main/Plex";
import { Message, MessageEmbed, TextChannel } from "discord.js";

module.exports = class {
    client: Plex;
    constructor(client) {
        this.client = client;
    }
    async run(oldMessage, newMessage: Message) {
        this.client.emit("message", newMessage);
        let guild;
        if (newMessage.guild)
            guild = await this.client.findOrCreateGuild({ id: newMessage.guild.id });
        if (!guild) return;
        if (guild.logs.messageEdit) {
            if (newMessage.author.bot) return;
            const logChannel = (await this.client.channels.fetch(
                guild.logs.messageEdit
            )) as TextChannel;
            const log = new MessageEmbed();
            log.setColor(guild.embedColor)
                .setAuthor("Message Edited", newMessage.author.avatarURL())
                .setTitle(`[<@${newMessage.author.id}> edited a message](${newMessage.url})`)
                .addField("Before", oldMessage.content)
                .addField("After", `[${newMessage.content}](${newMessage.url})`)
                .setFooter(newMessage.author.id + "•" + newMessage.author.tag)
                .setTimestamp(newMessage.editedAt);
            return await logChannel.send(log);
        }
    }
};
