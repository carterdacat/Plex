import BitField from "../utils/BitField";
import { LogEventResolvable, LogEventString, LogEventFlags } from "./Types";

/**
 * @extends {BitField}
 */
export default class LogEvents extends BitField<LogEventString> {
    public static FLAGS: LogEventFlags;
    static ALL: number;
    static DEFAULT: number;
    /**
     * @name Events
     * @kind constructor
     * @memberof Events
     * @param {LogEventResolvable} [bits=0] Bit(s) to read from
     */
    constructor(bits: LogEventResolvable = 0) {
        super(bits, LogEvents.FLAGS);
    }
    /**
     * Data that can be resolved to give a permission number. This can be:
     * * A string (see {@link LogEvents.FLAGS})
     * * A permission number
     * * An instance of Events
     * * An Array of LogEventResolvable
     * @typedef {string|number|Events|LogEventResolvable[]} LogEventResolvable
     */

    /**
     * Checks whether the bitfield has a permission, or any of multiple Events.
     * @param {LogEventResolvable} permission Permission(s) to check for
     * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
     * @returns {boolean}
     */
    any(permission: LogEventResolvable): boolean {
        return super.any(permission);
    }

    /**
     * Checks whether the bitfield has a permission, or multiple Events.
     * @param {LogEventResolvable} permission Permission(s) to check for
     * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
     * @returns {boolean}
     */
    has(permission: LogEventResolvable): boolean {
        return super.has(permission);
    }
}

/**
 * Numeric event flags. All available properties:
 * * `ADMINISTRATOR` (implicitly has *all* Events, and bypasses all channel overwrites)
 * * `CREATE_INSTANT_INVITE` (create invitations to the guild)
 * * `KICK_MEMBERS`
 * * `BAN_MEMBERS`
 * * `MANAGE_CHANNELS` (edit and reorder channels)
 * * `MANAGE_GUILD` (edit the guild information, region, etc.)
 * * `ADD_REACTIONS` (add new reactions to messages)
 * * `VIEW_AUDIT_LOG`
 * * `PRIORITY_SPEAKER`
 * * `STREAM`
 * * `VIEW_CHANNEL`
 * * `SEND_MESSAGES`
 * * `SEND_TTS_MESSAGES`
 * * `MANAGE_MESSAGES` (delete messages and reactions)
 * * `EMBED_LINKS` (links posted will have a preview embedded)
 * * `ATTACH_FILES`
 * * `READ_MESSAGE_HISTORY` (view messages that were posted prior to opening Discord)
 * * `MENTION_EVERYONE`
 * * `USE_EXTERNAL_EMOJIS` (use emojis from different guilds)
 * * `VIEW_GUILD_INSIGHTS`
 * * `CONNECT` (connect to a voice channel)
 * * `SPEAK` (speak in a voice channel)
 * * `MUTE_MEMBERS` (mute members across all voice channels)
 * * `DEAFEN_MEMBERS` (deafen members across all voice channels)
 * * `MOVE_MEMBERS` (move members between voice channels)
 * * `USE_VAD` (use voice activity detection)
 * * `CHANGE_NICKNAME`
 * * `MANAGE_NICKNAMES` (change other members' nicknames)
 * * `MANAGE_ROLES`
 * * `MANAGE_WEBHOOKS`
 * * `MANAGE_EMOJIS`
 * @type {Object}
 */
LogEvents.FLAGS = {
    JOIN: 1 << 0,
    LEAVE: 1 << 1,
    BAN: 1 << 2,
    UNBAN: 1 << 3,
    ROLE: 1 << 4,
    EDIT: 1 << 5,
    DELETE: 1 << 6,
    PURGE: 1 << 7,
    CHANNEL_CREATE: 1 << 8,
    CHANNEL_DELETE: 1 << 9,
    CHANNEL_UPDATE: 1 << 10,
    SERVER: 1 << 11,
    ROLE_CREATE: 1 << 12,
    ROLE_DELETE: 1 << 13,
    ROLE_UPDATE: 1 << 14,
    VOICE_JOIN: 1 << 15,
    VOICE_LEAVE: 1 << 16,
    VOICE_MOVE: 1 << 17,
    EMOJI_CREATE: 1 << 18,
    EMOJI_DELETE: 1 << 19,
    EMOJI_UPDATE: 1 << 20,
    AVATAR: 1 << 21,
    NAME: 1 << 22,
};

/**
 * Bitfield representing every permission combined
 * @type {number}
 */
LogEvents.ALL = Object.values(LogEvents.FLAGS).reduce((all: any, p: any) => all | p, 0);

/**
 * Bitfield representing the default Events for users
 * @type {number}
 */
LogEvents.DEFAULT = 0;
