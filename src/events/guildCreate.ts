import { Guild, GuildMember, MessageEmbed } from "discord.js";
module.exports = class {
    client: any;
    constructor(client) {
        this.client = client;
    }
    async run(guild: Guild) {
        guild = await guild.fetch();
        await this.client.findOrCreateUser({ id: guild.ownerID });
        await this.client.findOrCreateGuild({ id: guild.id });
        const welcomeMessage = new MessageEmbed();
        welcomeMessage
            .setTitle("Thanks For adding me!")
            .setDescription(`To configure the bot, do ${this.client.config.prefix}config.`);
        const owner: GuildMember = guild.owner as GuildMember;
        owner.send(welcomeMessage);
        return this.client.logger.log(
            `Joined a new server ${guild.name}. Now Serving ${this.client.guilds.cache.size} servers with ${this.client.users.cache.size}`,
            "log"
        );
    }
};
