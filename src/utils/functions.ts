import { Message, CollectorFilter, MessageCollector } from "discord.js";
import axios from "axios";
import { GuildMember } from "discord.js";
import { MessageEmbed } from "discord.js";
export function getRandom(array: Array<any>) {
    return array[Math.floor(Math.random() * array.length)];
}
export function convertMs(ms, delim = ":") {
    const showWith0 = (value) => (value < 10 ? `0${value}` : value);
    const days = showWith0(Math.floor((ms / (1000 * 60 * 60 * 24)) % 60));
    const hours = showWith0(Math.floor((ms / (1000 * 60 * 60)) % 24));
    const minutes = showWith0(Math.floor((ms / (1000 * 60)) % 60));
    const seconds = showWith0(Math.floor((ms / 1000) % 60));
    if (parseInt(days)) return `${days}d`;
    if (parseInt(hours)) return `${hours}h`;
    if (parseInt(minutes)) return `${minutes}min`;
    if (parseInt(seconds)) return `${seconds}s`;
    if (parseInt(ms)) return `${ms}ms`;
    // return `${parseInt(days) ? `${days} day${days > 1 ? 's' : ''}, ` : ''}${parseInt(hours) ? `${hours} hour${hours > 1 ? 's' : ''}, ` : ''}${parseInt(minutes) ? `${minutes} min${minutes > 1 ? 's' : ''},` : ''} ${seconds} sec${seconds > 1 ? 's' : ''}`;
}
export function convertBytes(bytes) {
    const decimals = 2;
    if (bytes == 0) return "0 Bytes";
    const k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
export async function awaitMessage(message, filter: CollectorFilter, time = 60000) {
    const promise = new Promise((resolve, reject) => {
        const x = new MessageCollector(message.channel, filter, {
            time: time,
        });
        x.on("collect", (msg) => {
            resolve(msg);
        });
        x.on("end", (a) => {
            reject(a);
        });
    });
    return await promise
        .then(function (msg: Message) {
            return msg;
        })
        .catch(function () {
            message.channel.send("Oops, your time ran out!");
            return null;
        });
}
export function arrayJoin(
    array: Array<any>,
    separator: string,
    specialChar: string,
    lastKeyword: string
) {
    return `${array
        .slice(0, array.length - 1)
        .join(separator)}${specialChar} ${lastKeyword} ${specialChar}${array[array.length - 1]}`;
}

export async function getTimeAfterLatestMessageInGuild(member: GuildMember) {
    const data = await axios({
        method: "get",
        data: {
            sort: [{ t: "desc" }],
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                u: member.user.id,
                            },
                        },
                        {
                            match: {
                                g: member.guild.id,
                            },
                        },
                    ],
                },
            },
        },
        url: `${process.env.elastic}/messages/_search`,
    });

    if (!data.data.hits.hits[0]) return 0;

    const msgTS = data.data.hits.hits[0]._source.t;

    const timeBetween = Date.now() - msgTS;
    return timeBetween;
}
export async function getTimeAfterLatestCommand(member: GuildMember, command) {
    const data = await axios({
        method: "get",
        data: {
            sort: [{ t: "desc" }],
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                u: member.user.id,
                            },
                        },
                        {
                            match: {
                                g: member.guild.id,
                            },
                        },
                        {
                            match: {
                                c: command,
                            },
                        },
                    ],
                },
            },
        },
        url: `${process.env.elastic}/commands/_search`,
    });

    if (!data.data.hits.hits[0]) return 0;

    const msgTS = data.data.hits.hits[0]._source.t;

    const timeBetween = Date.now() - msgTS;
    return timeBetween;
}
export async function getTimeAfterLatestXpMessageInGuild(member: GuildMember) {
    const data = await axios({
        method: "get",
        data: {
            sort: [{ t: "desc" }],
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                u: member.user.id,
                            },
                        },
                        {
                            match: {
                                g: member.guild.id,
                            },
                        },
                        {
                            match: {
                                xp: true,
                            },
                        },
                    ],
                },
            },
        },
        url: `${process.env.elastic}/messages/_search`,
    });

    if (!data.data.hits.hits[0]) return 0;

    const msgTS = data.data.hits.hits[0]._source.t;

    const timeBetween = Date.now() - msgTS;
    return timeBetween;
}
export function escapeRegex(str: string) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

export function disambiguation(items: Array<any>, label, property = "name") {
    const itemList = items
        .map((item) => `"${(property ? item[property] : item).replace(/ /g, "\xa0")}"`)
        .join(",   ");
    return `Multiple ${label} found, please be more specific: ${itemList}`;
}

export function paginate(items: Array<any> | string, page = 1, pageLength = 10) {
    const maxPage = Math.ceil(items.length / pageLength);
    if (page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    const startIndex = (page - 1) * pageLength;
    return {
        items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
        page,
        maxPage,
        pageLength,
    };
}

export const permissions = {
    ADMINISTRATOR: "Administrator",
    VIEW_AUDIT_LOG: "View audit log",
    MANAGE_GUILD: "Manage server",
    MANAGE_ROLES: "Manage roles",
    MANAGE_CHANNELS: "Manage channels",
    KICK_MEMBERS: "Kick members",
    BAN_MEMBERS: "Ban members",
    CREATE_INSTANT_INVITE: "Create instant invite",
    CHANGE_NICKNAME: "Change nickname",
    MANAGE_NICKNAMES: "Manage nicknames",
    MANAGE_EMOJIS: "Manage emojis",
    MANAGE_WEBHOOKS: "Manage webhooks",
    VIEW_CHANNEL: "Read text channels and see voice channels",
    SEND_MESSAGES: "Send messages",
    SEND_TTS_MESSAGES: "Send TTS messages",
    MANAGE_MESSAGES: "Manage messages",
    EMBED_LINKS: "Embed links",
    ATTACH_FILES: "Attach files",
    READ_MESSAGE_HISTORY: "Read message history",
    MENTION_EVERYONE: "Mention everyone",
    USE_EXTERNAL_EMOJIS: "Use external emojis",
    ADD_REACTIONS: "Add reactions",
    CONNECT: "Connect",
    SPEAK: "Speak",
    MUTE_MEMBERS: "Mute members",
    DEAFEN_MEMBERS: "Deafen members",
    MOVE_MEMBERS: "Move members",
    USE_VAD: "Use voice activity",
};
