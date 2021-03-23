/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import Plex from "../main/Plex";
import { Message, GuildChannel, TextChannel, MessageEmbed, Role } from "discord.js";
import axios from "axios";
import * as Errors from "../main/Errors";
module.exports = class {
    client: Plex;
    data: any;
    constructor(client: Plex) {
        this.client = client;
        this.data = {
            guild: {},
            member: {},
            user: {},
        };
    }
    async run(message: Message) {
        if (message.author.bot) return;
        if (message.system) return;
        this.client.messages.inc();
        if (message.guild && !message.member) {
            await message.guild.members.fetch(message.author.id);
        }

        if (message.guild) {
            const guild = await this.client.findOrCreateGuild({ id: message.guild.id });
            this.data.guild = guild;
        }

        if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>( |)$`))) {
            return message.reply(`My prefix is ${this.data.guild.prefix}`);
        }
        if (message.guild) {
            // Gets the data of the member
            const memberData = await this.client.findOrCreateMember({
                id: message.author.id,
                guildID: message.guild.id,
            });
            this.data.member = memberData;
        }
        const userData = await this.client.findOrCreateUser({ id: message.author.id });
        this.data.user = userData;
        /*        let allowedRole;
        message.member.roles.cache.forEach((r) => {
            if (this.data.guild.autoMod.allowedRole.includes(r.id)) allowedRole = true;
        });*/
        if (message.guild) {
            if (
                this.data.guild.nickname !== message.guild.me.nickname &&
                message.guild.me.hasPermission("MANAGE_NICKNAMES")
            ) {
                this.data.guild.nickname = message.guild.me.nickname;
                await axios({
                    method: "put",
                    url: `http://localhost:${process.env.PORT || 3000}/guild`,
                    params: {
                        id: message.guild.id,
                    },
                    data: this.data.guild,
                });
            }

            const xp = await updateXp(message, this.data, this.client);

            await axios({
                url: `${process.env.elastic}/messages/_doc/`,
                method: "post",
                data: {
                    c: message.content,
                    m: message.id,
                    u: message.author.id,
                    g: message.guild.id,
                    t: message.createdTimestamp,
                    xp: xp,
                },
            });
        }
        const afkReason = this.data.user.afk;
        if (afkReason) {
            this.data.user.afk = null;
            await axios({
                url: `http://localhost:${process.env.PORT || 3000}/user`,
                method: "put",
                params: {
                    id: this.data.user.id,
                },
                data: this.data.user,
            });
            await message.channel
                .send(`Welcome back <@${message.author.id}>! I've turned of your afk.`)
                .then((m) => m.delete({ timeout: 5000 }));
        }
        for (const u of message.mentions.users) {
            const userData: any = await this.client.findOrCreateUser({ id: u[1].id });
            if (userData.afk) {
                message
                    .reply(`<@${u[1].id}> is afk for reason: \`${userData.afk}\``)
                    .then((m) => m.delete({ timeout: 5000 }));
            }
        }
        if (this.data.guild.autoResponses[0][message.content]) {
            return message.channel.send(this.data.guild.autoResponses[0][message.content]);
        }
        let cmd;
        let args;
        /*--------------------------COMMAND------------------------------*/
        try {
            const prefix: any = await getPrefix(message, this.data, this.client);
            if (!prefix) return;
            args = message.content
                .slice(typeof prefix === "string" ? prefix.length : 0)
                .trim()
                .split(/ +/g);
            const command = args.shift().toLowerCase();
            cmd =
                this.client.commands.get(command) ||
                this.client.commands.get(this.client.aliases.get(command));
            if (!cmd) return;
            if (cmd.conf.guildOnly && !message.guild) {
                await message.react(this.client.config.emojis.error);
                throw new Errors.GuildOnlyCommandError(message);
            }
            if (cmd.help.category === "Dev" && !this.client.config.devs.includes(message.author.id))
                return;
            if (message.guild) {
                const channel = message.channel as GuildChannel;
                let neededPermission = [];
                if (!cmd.conf.botPermissions.includes("EMBED_LINKS")) {
                    cmd.conf.botPermissions.push("ADD_REACTIONS");
                    cmd.conf.botPermissions.push("USE_EXTERNAL_EMOJIS");
                }
                cmd.conf.botPermissions.forEach((perm) => {
                    if (!channel.permissionsFor(message.guild.me).has(perm)) {
                        neededPermission.push(perm);
                    }
                });
                if (neededPermission.length > 0) {
                    await message.react(this.client.config.emojis.error);
                    throw new Errors.BotPermissionError(
                        message,
                        neededPermission.map((p) => `${p}`).join(", ")
                    );
                }
                neededPermission = [];
                cmd.conf.memberPermissions.forEach((perm) => {
                    if (!channel.permissionsFor(message.member).has(perm)) {
                        neededPermission.push(perm);
                    }
                });
                if (neededPermission.length > 0) {
                    await message.react(this.client.config.emojis.error);
                    throw new Errors.UserPermissionError(
                        message,
                        neededPermission.map((p) => `\`${p}\``).join(", ")
                    );
                }
                if (this.data.guild.ignoredCat.includes(cmd.help.category)) {
                    await message.react(this.client.config.emojis.error);
                    throw new Errors.CommandError(message, "This category is disabled");
                }
                if (this.data.guild.ignoredChannels.includes(message.channel.id)) {
                    await message.react(this.client.config.emojis.error);
                    throw new Errors.CommandError(message, "Commands are disabled here");
                }
                let blockedRole: any = false;
                message.member.roles.cache.forEach((role: Role) => {
                    if (this.data.guild.ignoredRoles.includes(role.id)) return (blockedRole = role);
                });
                if (blockedRole && !message.member.hasPermission("ADMINISTRATOR")) {
                    await message.react(this.client.config.emojis.error);
                    throw new Errors.CommandError(
                        message,
                        `Commands are forbidden from you due to your role: <@&${blockedRole.id}> being blocked in ${message.guild.name}`
                    );
                }
                if (
                    !channel.permissionsFor(message.member).has("MENTION_EVERYONE") &&
                    (message.content.includes("@everyone") || message.content.includes("@here"))
                ) {
                    await message.react(this.client.config.emojis.error);
                    throw new Errors.CommandError(
                        message,
                        "You are not allowed to mention everyone or here in the commands."
                    );
                }
                if (!(channel as TextChannel).nsfw && cmd.conf.nsfw) {
                    await message.react(this.client.config.emojis.error);
                    throw new Errors.CommandError(
                        message,
                        "You must go to in a channel that allows the NSFW to type this command!"
                    );
                }
            }

            if (!cmd.conf.enabled) {
                await message.react(this.client.config.emojis.error);
                throw new Errors.CommandError(message, "This command is currently disabled!");
            }
            const timeSince = await this.client.latestCommand(message.member, cmd.help.name);
            if (cmd.conf.cooldown > timeSince) {
                return message.channel
                    .send(
                        `heyyyyy, enter the chillzone, and wait ${Math.ceil(
                            (cmd.conf.cooldown - timeSince) / 1000
                        )} seconds to use that command again`
                    )
                    .then((msg: Message) => {
                        return setTimeout(() => msg.delete(), 2000);
                    });
            }
            this.client.logger.log(
                `${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`,
                "cmd"
            );
            const doc = await axios({
                url: `${process.env.elastic}/commands/_doc/`,
                method: "post",
                data: {
                    c: cmd.help.name,
                    a: message.author.tag,
                    aid: message.author.id,
                    g: message.guild.name,
                    gid: message.guild.id,
                },
            });
        } catch (e) {
            if (e.name === "BotPermissionError" || e.name === "UserPermissionError") {
                const embed = new MessageEmbed();
                embed
                    .setColor(this.data.guild.embedColor)
                    .setTitle(e.name)
                    .setDescription(
                        e.message + "\n Required Permissions: \n" + `\`${e.MissingPermission}\``
                    )
                    .setFooter(this.client.version)
                    .setTimestamp();
                return e.DiscordMessage.channel
                    .send(embed)
                    .then((m) => m.delete({ timeout: 5000 }));
            }
            const embed = new MessageEmbed();
            embed
                .setColor(this.data.guild.embedColor)
                .setTitle(e.name)
                .setDescription(e.message)
                .setFooter(this.client.version)
                .setTimestamp();
            return await message.channel.send(embed).then((m) => m.delete({ timeout: 5000 }));
        }
        try {
            await cmd.run(message, args, this.data);
            if (cmd.help.category === "Moderation" && this.data.guild.autoDeleteModCommands) {
                await message.delete();
            }
            this.client.commandCount.inc();
        } catch (e) {
            await message.react(this.client.config.emojis.error);
            const embed = new MessageEmbed();
            embed
                .setColor(this.data.guild.emedColor)
                .setTitle(e.name)
                .setDescription(e.message)
                .setFooter(this.client.version)
                .setTimestamp();
            return message.channel.send(embed).then((m) => m.delete({ timeout: 5000 }));
        }
    }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function updateXp(
    msg: Message,
    data: { guild?: any; member?: any; user?: any },
    client: Plex
) {
    if (!data.guild.xp) return false;

    if (data.guild.xpIgnored.includes[msg.channel.id]) return false;

    const points: number = parseInt(data.member.exp);
    const level: number = parseInt(data.member.level);

    if (data.guild.xpIgnored.includes(msg.channel.id)) return false;

    if (msg.editedAt) return false;

    /*    const isInCooldown = xpCooldown[msg.author.id];
    if (isInCooldown) {
        if (isInCooldown > Date.now()) {
            return;
        }
    }
*/
    const time = await client.latestXp(msg.member);
    if (data.guild.xpCooldown > time) return false;
    const toWait = Date.now() + data.guild.xpCooldown;

    const won = Math.ceil(
        (Math.random() + 1) *
            (Math.floor((Math.random() + 1) * Math.ceil(Math.random() * 5)) *
                data.guild.xpMultiplier)
    );
    const newXp = points + won;

    const neededXp = 5 * (level * level) + 80 * level + 100;

    data.member.exp = newXp;
    await axios({
        url: `http://localhost:${process.env.PORT || 3000}/member`,
        method: "put",
        params: {
            id: data.member.id,
            guildID: data.member.guildID,
        },
        data: data.member,
    });

    if (newXp > neededXp) {
        data.member.level = level + 1;
        await axios({
            url: `http://localhost:${process.env.PORT || 3000}/member`,
            method: "put",
            params: {
                id: data.member.id,
                guildID: data.member.guildID,
            },
            data: data.member,
        });
        if (data.guild.levelUpChannel) await msg.react(client.config.emojis.upArrow);
        data.guild.levelUpChannel
            ? client.emit("levelUpChannel", msg.member)
            : client.emit("levelUpMessage", msg);
    }

    await axios({
        url: `http://localhost:${process.env.PORT || 3000}/member`,
        method: "put",
        params: {
            id: data.member.id,
            guildID: data.member.guildID,
        },
        data: data.member,
    });
    return true;
}

async function getPrefix(
    message: { channel: { type: string }; client: { user: { id: any } }; content: string },
    data: { guild: any; member?: any; user?: any },
    client: { config: { botname: any } }
) {
    if (message.channel.type !== "dm") {
        const prefixes = [`<@${message.client.user.id}>`, client.config.botname, data.guild.prefix];
        let prefix = null;
        prefixes.forEach((p) => {
            if (message.content.startsWith(p)) {
                prefix = p;
            }
        });
        return prefix;
    } else {
        return true;
    }
}
