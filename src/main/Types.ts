import { Guild } from "discord.js";
import BitField from "../utils/BitField";

/**
 * Log events
 * @catgeory Types
 */
export type LogEventString =
    | "JOIN"
    | "LEAVE"
    | "BAN"
    | "UNBAN"
    | "ROLE"
    | "EDIT"
    | "DELETE"
    | "PURGE"
    | "CHANNEL_CREATE"
    | "CHANNEL_DELETE"
    | "CHANNEL_UPDATE"
    | "SERVER"
    | "ROLE_CREATE"
    | "ROLE_DELETE"
    | "ROLE_UPDATE"
    | "VOICE_JOIN"
    | "VOICE_MOVE"
    | "VOICE_LEAVE"
    | "EMOJI_CREATE"
    | "EMOJI_DELETE"
    | "EMOJI_UPDATE"
    | "AVATAR"
    | "NAME";
/**
 * The flags of the log event
 * @category Types
 */
export type LogEventFlags = Record<LogEventString, number>;
/**
 * Data that can be resolved to give a permission number. This can be:
 * * A string (see {@link LogEvents.FLAGS})
 * * A permission number
 * * An instance of Events
 * * An Array of LogEventResolvable
 * @typedef {string|number|Events|LogEventResolvable[]} LogEventResolvable
 */

export type LogEventResolvable = BitFieldResolvable<LogEventString>;
export type BitFieldResolvable<T extends string> =
    | RecursiveReadonlyArray<T | number | Readonly<BitField<T>>>
    | T
    | number
    | Readonly<BitField<T>>;
/**
 * A read only array
 * @category Types
 */
export type RecursiveReadonlyArray<T> = ReadonlyArray<T | RecursiveReadonlyArray<T>>;
/**
 * Logger types
 * @category Types
 */
export type loggerTypes = "log" | "warn" | "error" | "debug" | "cmd" | "ready" | "rest";
/**
 * {@link resolveChannel | Resolve Channel} Options
 * @category Types
 */
export type resolveChannelOptions = {
    guild: Guild;
    search: string;
    channelType: "text" | "voice" | "dm";
};
