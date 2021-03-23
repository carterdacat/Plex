/* import Plex from "../main/Plex";

module.exports = class {
    client: Plex;
    constructor(client: Plex) {
        this.client = client;
    }

    async run() {}
};
*/
import Plex from "../main/Plex";
import { GuildEmoji } from "discord.js";
import { MessageEmbed } from "discord.js";

module.exports = class {
    client: Plex;
    constructor(client: Plex) {
        this.client = client;
    }

    async run(emoji: GuildEmoji) {
        const guild = await this.client.findOrCreateGuild({ id: emoji.guild.id });

        if ((guild.logs.bits & 262144) === 262144) {
            const channel = await this.client.resolveChannel({
                guild: emoji.guild,
                search: guild.logs.emojiAdd,
                channelType: "TextChannel",
            });

            const member = await emoji.fetchAuthor();
            const premiumEmojiCountArray = [50, 100, 150, 250];
            const totalEmojis = premiumEmojiCountArray[emoji.guild.premiumTier];
            const remainingEmojis = totalEmojis - emoji.guild.emojis.cache.array.length;
            const embed = new MessageEmbed()
                .setTitle("Emoji Added")
                .setAuthor(member.tag, member.avatarURL())
                .addField(emoji.name, `<:${emoji.name}:${emoji.id}>`)
                .setFooter(remainingEmojis + " emojis left")
                .setTimestamp();
            return await channel.send(embed);
        }
    }
};
