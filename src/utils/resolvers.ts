import { Guild } from "discord.js";
/**
 * Resolves a channel in a guild
 * @param options the options used to find a channel.
 */
export const resolveChannel = async ({ guild, search, channelType }) => {
    const contentToCheck = search;
    if (!contentToCheck || typeof contentToCheck !== "string") return;
    // Try by parsing the search
    if (contentToCheck.match(/^<#([0-9]{18})>/)) {
        const [, channelID] = contentToCheck.match(/^<#([0-9]{18})>/);
        const channelFound = guild.channels.cache.get(channelID);
        if (channelFound && channelType && channelFound.type === channelType) return channelFound;
    }
    // Try with ID
    if (guild.channels.cache.has(search)) {
        const channelFound = guild.channels.cache.get(search);
        if (channelFound && channelType && channelFound.type === channelType) return channelFound;
    }
    // Try with name with
    if (
        guild.channels.cache.some(
            (channel) => `#${channel.name}` === search || channel.name === search
        )
    ) {
        const channelFound = guild.channels.cache.find(
            (channel) => `#${channel.name}` === search || channel.name === search
        );
        if (channelFound && channelType && channelFound.type === channelType) return channelFound;
    }
    if (guild.channels.resolve(search)) return guild.channels.resolve(search);
};

export const resolveMember = async ({ guild, search }) => {
    const contentToCheck = search;
    if (!contentToCheck || typeof contentToCheck !== "string") return;
    // Try by parsing the search
    if (contentToCheck.match(/^<@!?(\d+)>$/)) {
        const [, userID] = contentToCheck.match(/^<@!?(\d+)>$/);
        const memberFound = await guild.members.fetch(userID).catch(() => {});
        if (memberFound) return memberFound;
    }
    // Try with ID
    if (await guild.members.fetch(search).catch(() => {})) {
        const memberFound = await guild.members.fetch(search);
        if (memberFound) return memberFound;
    }
    // Try with name with @
    await guild.members.fetch({
        query: search,
    });
    if (
        guild.members.cache.some(
            (member) => member.user.tag === search || member.user.username === search
        )
    ) {
        const memberFound = guild.members.cache.find(
            (member) => member.user.tag === search || member.user.username === search
        );
        if (memberFound) return memberFound;
    }
    return;
};

export const resolveRole = async ({ guild, search }) => {
    const contentToCheck = search;
    if (!contentToCheck || typeof contentToCheck !== "string") return;
    // Try by parsing the search
    if (contentToCheck.match(/^<@&([0-9]{18})>/)) {
        const [, roleID] = contentToCheck.match(/^<@&([0-9]{18})>/);
        const roleFound = guild.roles.cache.get(roleID);
        if (roleFound) return roleFound;
    }
    // Try with ID
    if (guild.roles.cache.has(search)) {
        const roleFound = guild.roles.cache.get(search);
        if (roleFound) return roleFound;
    }
    // Try with name with @
    if (guild.roles.cache.some((role) => `@${role.name}` === search || role.name === search)) {
        const roleFound = guild.roles.cache.find(
            (role) => `@${role.name}` === search || role.name === search
        );
        if (roleFound) return roleFound;
    }
    return;
};
