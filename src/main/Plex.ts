/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, Collection, ClientOptions, GuildMember } from "discord.js";
import Config from "../config";
import logger from "./logger";
import path from "path";
import util from "util";
import mutes from "../utils/unMutes";
import io from "@pm2/io";
import packagejs from "../../package.json";
import Counter from "@pm2/io/build/main/utils/metrics/counter";
import findOrCreateGuild from "../utils/findOrCreateGuild";
import findOrCreateUser from "../utils/findOrCreateUser";
import findOrCreateMember from "../utils/findOrCreateMember";
import { resolveRole, resolveChannel, resolveMember } from "../utils/resolvers";
import dbl from "../utils/dbl";
import docUpdate from "../utils/docUpdate";
import Command from "./Command";
import * as Functions from "../utils/functions";

declare module "discord.js" {
    interface ClientEvents {
        levelUpMessage: [Message];
        levelUpChannel: [GuildMember];
    }
}

/**
 * This is the bots main client that extends discords client.
 * @extends {Client}
 * @category Classes.client
 */
class Plex extends Client {
    /**
     * The count of messages the bot has seen
     */
    public messages: Counter;
    /**
     * The cound of commands the bot has executed
     */
    public commandCount: Counter;
    /**
     * The configuration of the bot
     */
    public config: {
        devs: string[];
        emojis: {
            nine: string;
            six: string;
            downArrow: string;
            one: string;
            seven: string;
            check: string;
            error: string;
            two: string;
            three: string;
            leftArrow: string;
            eight: string;
            rightArrow: string;
            upArrow: string;
            zero: string;
            four: string;
            ten: string;
            five: string;
        };
        botname: string;
        prefix: string;
        mongodb: any;
        colors: {
            red: string;
            orange: string;
            green: string;
            lightRed: string;
            blue: string;
            darkRed: string;
            lightBlue: string;
            yellow: string;
            purple: string;
            brown: string;
        };
        token: any;
        status: { name: string; type: string }[];
    };
    /**
     * The collection of commands
     */
    public commands: Collection<string, Command>;
    /**
     * The collection of aliases
     */
    public aliases: Collection<string, string>;
    /**
     * The logger class used to log nicely
     * @method Log the function to log something
     */
    public logger: logger;
    public dev: boolean;
    /**
     * Await this and it will wait set ammount of time
     */
    public wait: { (ms: number): Promise<any>; (ms: number, value: any): Promise<any> };
    /**
     * Finds or creates a member data
     */
    public findOrCreateMember: ({
        id: id,
        guildID,
    }: {
        id: string;
        guildID: string;
    }) => Promise<any>;
    /**
     * finds or creates a guild data
     */
    public findOrCreateGuild: ({ id: guildID }: { id: string }) => Promise<any>;
    /**
     * Find or creates a user data
     */
    public findOrCreateUser: ({ id: id }: { id: string }) => Promise<any>;
    /**
     * The bots version, stated in package.json
     */
    public version: string;
    /**
     * Starts to post stats to DBL
     * @param {object} client The Discord Client instance
     */
    public dbl: (client) => any;
    /**
     * Update the doc
     * @param {object} client The Discord Client instance
     */
    public docUpdate: (client: Plex) => any;
    /**
     * Collection of muted user data
     */
    public muted: Collection<string, any>;
    /**
     * Starts checking...
     * @param {object} client The Discord Client instance
     */
    public unMutes: (client: Plex) => Promise<any>;
    public resolveRole: ({ guild, search }: { guild: any; search: any }) => Promise<any>;
    public resolveChannel: ({
        guild,
        search,
        channelType,
    }: {
        guild: any;
        search: any;
        channelType: any;
    }) => Promise<any>;
    resolveMember: ({ guild, search }: { guild: any; search: any }) => Promise<any>;
    /**
     * Gets the time beween the latest message from the member
     */
    latestMessage: (member: GuildMember) => Promise<number>;
    /**
     * Gets the the time between the latest command
     */
    latestCommand: (member: GuildMember, command: any) => Promise<number>;
    /**
     * Joins a array
     */
    arrayJoin: (
        array: any[],
        separator: string,
        specialChar: string,
        lastKeyword: string
    ) => string;
    /**
     * Awaits a message
     */
    awaitMessage: (
        message: any,
        filter: import("discord.js").CollectorFilter,
        time: number
    ) => Promise<any>;
    /**
     * Converts bytes to a bigger version
     */
    convertBytes: (bytes: any) => string;
    /**
     * Converts ms to a bigger version
     */
    convertMs: (ms: any, delim?: string) => string;
    /**
     * Gets a random part of an array
     */
    getRandom: (array: any[]) => any;
    /**
     * Gets the time since the latest xp gain in a guild
     */
    latestXp: (member: GuildMember) => Promise<number>;
    escapeRegex: (str: string) => string;
    paginate: (
        items: string | any[],
        page?: number,
        pageLength?: number
    ) => { items: string | any[]; page: number; maxPage: number; pageLength: number };
    disambiguation: (items: any[], label: any, property?: string) => string;
    permissions: any;
    /**
     * @param dev
     * @param options
     */
    constructor(dev: boolean, options?: ClientOptions) {
        super(options);
        this.messages = io.counter({
            name: "Messages Seen",
        });

        this.commandCount = io.counter({
            name: "Commands sent",
        });

        this.config = Config;

        this.commands = new Collection();

        this.aliases = new Collection();

        this.logger = new logger();

        this.dev = dev;

        this.wait = util.promisify(setTimeout);

        this.findOrCreateMember = findOrCreateMember;

        this.findOrCreateGuild = findOrCreateGuild;

        this.findOrCreateUser = findOrCreateUser;

        this.version = packagejs.version;

        this.resolveRole = resolveRole;

        this.resolveChannel = resolveChannel;

        this.resolveMember = resolveMember;

        this.dbl = dbl;

        this.docUpdate = docUpdate;

        this.muted = new Collection();

        this.unMutes = mutes;

        this.latestMessage = Functions.getTimeAfterLatestMessageInGuild;

        this.latestCommand = Functions.getTimeAfterLatestCommand;

        this.arrayJoin = Functions.arrayJoin;

        this.awaitMessage = Functions.awaitMessage;

        this.convertBytes = Functions.convertBytes;

        this.convertMs = Functions.convertMs;

        this.getRandom = Functions.getRandom;

        this.latestXp = Functions.getTimeAfterLatestXpMessageInGuild;

        this.escapeRegex = Functions.escapeRegex;

        this.paginate = Functions.paginate;

        this.disambiguation = Functions.disambiguation;

        this.permissions = Functions.permissions;
    }

    async addCommandSeen() {
        this.commandCount.inc();
    }
    async addMessageSeen() {
        this.messages.inc();
    }
    // This function is used to load a command and add it to the collection
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadCommand(commandPath: any, commandName: any) {
        try {
            const props = new (require(`.${commandPath}${path.sep}${commandName}`))(this);
            this.logger.log(
                `Loading Command: ${props.help.name} from ${props.help.category}`,
                "log"
            );
            props.conf.location = commandPath;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.help.name.toLowerCase(), props);
            props.conf.aliases.forEach((alias: string) => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }
}
export default Plex;
