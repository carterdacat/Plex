import mongoose from "mongoose";
const Schema = mongoose.Schema;

const guild = mongoose.model(
    "Guild",
    new Schema({
        id: { type: String }, // Discord ID of the
        membersData: { type: Array, default: {} }, // Members data of the
        members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
        prefix: { type: String, default: "!" }, // Default or custom prefix of the
        xp: { type: Boolean, default: true },
        ignoredChannels: { type: Array, default: [] }, // Channels ignored by the bot {Untested}
        ignoredCat: { type: Array, default: [] }, // igonred catigories {UnImplimented}
        ignoredRoles: { type: Array, default: [] }, // Ignored roles {Untested}
        autoDeleteModCommands: { type: Boolean, default: false }, // Whether to auto delete moderation commands {Untested, shoullldd... work}
        modResult: { type: Boolean, default: true }, // TO send the embed after a mod cmd
        nickname: { type: String, default: "Plex" }, //Nickname of the bot, if you change the nickname, it will change here {Untedted changing part}
        autoResponses: { type: Array, default: {} }, //Auto responces {Untested}
        suggestions: { type: String, default: null }, // Suggestion channel {not implimented}
        welcome: { type: String, default: null }, // Welcome channel {not implimented}
        welcomeMessage: { type: String, default: "Welcome to our guild!" }, //Message of the welcome message
        goodbye: { type: String, default: null }, // Leave channel {not implimmented}
        goodbyeMessage: { type: String, default: "Someone just left our guild" }, // Message of the leave message
        reports: { type: String, default: null }, // Report channel {un iimpliemnted}sssss
        embedColor: { type: String, default: "#000000" }, // Color of embeds
        autoRole: { type: String, default: null }, //Role to automaticly be given
        warnLimitKick: { type: Number, default: null }, //When to kick if a user has said ammount of warns {Un implimented}
        warnLimitBan: { type: Number, default: null }, //When to ban if a user has said ammount of warns {Un implimented}
        levelColor: { type: String, default: "#000000" }, //Color for the level message (HEX) {Unplimented}
        version: { type: Number, default: 1 }, //The version of this document of data
        xpMultiplier: { type: Number, default: 1 }, //The multipier for xp gain
        xpCooldown: { type: Number, default: 60000 }, //The cooldown for xp gain
        xpIgnored: { type: Array, default: [] }, //Ignored channel for xp gain {Unimplimented}
        levelUpChannel: { type: String, default: null }, //The channel for level up, defaults to sending message after message
        autoMod: {
            type: Schema.Types.Mixed,
            default: {},
        },
        logs: {
            type: Schema.Types.Mixed,
            default: {
                bit: 0,
                ignoredChannel: [],
                ignoredUsers: [],
            },
        },
        modlogs: { type: Array, default: [] },
    })
);

export default guild;
