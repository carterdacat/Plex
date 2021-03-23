import { Message } from "discord.js";
/**
 * Command error is the base for all errors. When all other errors don't fit throw this
 * @extends Error
 * @param [DiscordMessage] The message that it errored on
 * @param [Message] Message
 */
export class CommandError extends Error {
    public DiscordMessage: Message;
    constructor(DiscordMessage: Message, Message?: string, ...args: any) {
        super(...args);
        this.name = this.constructor.name;
        this.DiscordMessage = DiscordMessage;
        this.message = Message;
        CommandError.captureStackTrace(this, CommandError);
    }
}

/**
 * Arg Error is when a problem has happened because of an argument
 * @extends CommandError
 * @param [DiscordMessage] The message that it errored on
 * @param [argPosition] The arg position
 * @param [requiredArg] The required arg
 */
export class ArgsError extends CommandError {
    public araPoss: any;
    public requiredArg: any;
    public DiscordMessage: any;
    constructor(DiscordMessage: Message, argPosition: number, requiredArg: string, ...args: any) {
        super(DiscordMessage, ...args);
        this.araPoss = argPosition;
        this.requiredArg = requiredArg;
        this.DiscordMessage = DiscordMessage;
        this.message = `A argument error occurred. \n Arg Position: ${argPosition} \n Required Arg: ${requiredArg}`;
        ArgsError.captureStackTrace(this, ArgsError);
    }
}
/**
 * Missing Arg is to be thrown when an arg is missing
 * @extends ArgsError
 * @param [DiscordMessage] The message that it errored on
 * @param [argPosition] The arg position
 * @param [requiredArg] The required arg
 */
export class MissingArg extends ArgsError {
    public argPosition: any;
    public DiscordMessage: any;
    public requiredArg: any;
    constructor(DiscordMessage: Message, argPosition: number, requiredArg: string, ...args: any) {
        super(DiscordMessage, argPosition, requiredArg, ...args);
        this.argPosition = argPosition;
        this.requiredArg = requiredArg;
        this.DiscordMessage = DiscordMessage;
        MissingArg.captureStackTrace(this, MissingArg);
        this.message = `A argument was missing in the command \n Arg Position: ${argPosition} \n Required Arg: ${requiredArg}`;
    }
}
/**
 * When a mention is expected, but nothing is received
 * @extends MissingArg
 * @param [DiscordMessage] The message that it errored on
 * @param [argPosition] The arg position
 * @param [requiredArg] The required arg
 */
export class MissingMention extends MissingArg {
    public argPosition: any;
    public DiscordMessage: any;
    public requiredArg: any;
    constructor(DiscordMessage: Message, argPosition: number, requiredArg: string, ...args: any) {
        super(DiscordMessage, argPosition, requiredArg, ...args);
        MissingMention.captureStackTrace(this, MissingMention);
        this.argPosition = argPosition;
        this.requiredArg = requiredArg;
        this.DiscordMessage = DiscordMessage;
        this.message = `A mention/id/tag was expected, but the arg was empty. \n Arg Position: ${argPosition} \n Required Arg: ${requiredArg}`;
    }
}
/**
 * When a argument is received, but is invalid
 * @extends ArgsError
 * @param [DiscordMessage] The message that it errored on
 * @param [argPosition] The arg position
 * @param [requiredArg] The required arg
 */
export class InvalidArg extends ArgsError {
    public argPosition: any;
    public DiscordMessage: any;
    public requiredArg: any;
    constructor(DiscordMessage: Message, argPosition: number, requiredArg: string, ...args: any) {
        super(DiscordMessage, argPosition, requiredArg, ...args);
        InvalidArg.captureStackTrace(this, InvalidArg);
        this.argPosition = argPosition;
        this.requiredArg = requiredArg;
        this.DiscordMessage = DiscordMessage;
        this.message = `A argument provided was invalid data. \n Arg Position: ${argPosition} \n Required Arg: ${requiredArg}`;
    }
}
/**
 * When a argument is received, and its expected to me a mention, but its invalid
 * @extends InvalidArg
 * @param [DiscordMessage] The message that it errored on
 * @param [argPosition] The arg position
 * @param [requiredArg] The required arg
 */
export class InvalidMention extends InvalidArg {
    public argPosition: any;
    public DiscordMessage: any;
    public requiredArg: any;
    constructor(DiscordMessage: Message, argPosition: number, requiredArg: string, ...args: any) {
        super(DiscordMessage, argPosition, requiredArg, ...args);
        InvalidMention.captureStackTrace(this, InvalidMention);
        this.argPosition = argPosition;
        this.requiredArg = requiredArg;
        this.DiscordMessage = DiscordMessage;
        this.message = `A mention/id/tag was expected, but something else was received or it was invalid. \n Arg Position: ${argPosition} \n Required Arg: ${requiredArg}`;
    }
}

/**
 * When a required permission is not given
 * @extends CommandError
 * @param [DiscordMessage] The message that it errored on
 * @param [MissingPermission] The missing permissions
 */
export class PermissionError extends CommandError {
    public MissingPermission: any;
    public DiscordMessage: any;
    constructor(DiscordMessage: Message, MissingPermission: string, ...args) {
        super(DiscordMessage, ...args);
        PermissionError.captureStackTrace(this, PermissionError);
        this.message = `I was not able to complete the command due to a permission error. \n Missing Permissions: ${MissingPermission}`;
        this.MissingPermission = MissingPermission;
        this.DiscordMessage = DiscordMessage;
    }
}
/**
 * When the bot does not have a required permission
 * @extends PermissionError
 * @param [DiscordMessage] The message that it errored on
 * @param [MissingPermission] The missing permissions
 */
export class BotPermissionError extends PermissionError {
    public DiscordMessage: any;
    public MissingPermission: any;
    constructor(DiscordMessage: Message, MissingPermission: string, ...args) {
        super(DiscordMessage, MissingPermission, ...args);
        BotPermissionError.captureStackTrace(this, BotPermissionError);
        this.DiscordMessage = DiscordMessage;
        this.MissingPermission = MissingPermission;
        this.message =
            "I was not able to complete a command due to me not having enough permissions";
    }
}
/**
 * When a user does not have required permissions
 * @extends PermissionError
 * @param [DiscordMessage] The message that it errored on
 * @param [MissingPermission] The missing permissions
 */
export class UserPermissionError extends PermissionError {
    public DiscordMessage: any;
    public MissingPermission: any;
    public constructor(DiscordMessage: Message, MissingPermission: string, ...args) {
        super(DiscordMessage, MissingPermission, ...args);
        BotPermissionError.captureStackTrace(this, UserPermissionError);
        this.DiscordMessage = DiscordMessage;
        this.MissingPermission = MissingPermission;
        this.message =
            "I was not able to complete a command due to the user not having enough permissions";
    }
}
/**
 * When a command is ran in dms, but the command is guild only
 * @extends CommandError
 * @param [DiscordMessage] The message that it errored on
 */
export class GuildOnlyCommandError extends CommandError {
    public DiscordMessage: any;
    constructor(DiscordMessage: Message, ...args) {
        super(DiscordMessage, ...args);
        GuildOnlyCommandError.captureStackTrace(this, GuildOnlyCommandError);
        this.DiscordMessage = DiscordMessage;
        this.message = "A command was ran, but its guild only, and your not in a guild";
    }
}
