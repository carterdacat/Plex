/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import Plex from "./Plex";
import { PermissionResolvable } from "discord.js";
/**
 * The Default Command Class
 */
export default class Command {
    help: { name; description; category; usage; examples };
    conf: {
        enabled: boolean;
        guildOnly: boolean;
        aliases: any[];
        memberPermissions: PermissionResolvable;
        botPermissions: PermissionResolvable;
        nsfw: boolean;
        cooldown: number;
    };
    client: any;
    constructor(
        client: Plex,
        {
            name,
            dirname,
            enabled = true,
            guildOnly = false,
            description = null,
            usage = null,
            examples = null,
            aliases,
            botPermissions = [],
            memberPermissions = [],
            nsfw = false,
            cooldown = 3000,
        }: {
            name: string;
            dirname: string;
            enabled: boolean;
            guildOnly: boolean;
            description: string;
            examples: string;
            usage: string;
            aliases: any[];
            botPermissions: PermissionResolvable;
            memberPermissions: PermissionResolvable;
            nsfw: boolean;
            cooldown: number;
        }
    ) {
        // eslint-disable-next-line prettier/prettier
        const category = dirname
            ? dirname.split(path.sep)[dirname.split(path.sep).length - 1]
            : "Other";
        this.client = client;
        this.conf = {
            enabled,
            guildOnly,
            aliases,
            memberPermissions,
            botPermissions,
            nsfw,
            cooldown,
        };
        this.help = { name, description, category, usage, examples };
    }
}
