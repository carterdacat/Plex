import mongoose from "mongoose";
const a = mongoose.model(
    "Member",
    new mongoose.Schema({
        /* REQUIRED */
        id: { type: String }, // Discord ID of the user
        guildID: { type: String }, // ID of the guild to which the member is connected

        /* SERVER ECONOMY */
        exp: { type: Number, default: 0 }, // Exp points of the user
        level: { type: Number, default: 0 }, // Level of the user
        money: { type: Number, default: 0 },
        cooldowns: {
            type: Object,
            default: {
                work: 0,
                rob: 0,
            },
        },
        workStreak: { type: Number, default: 0 }, // work streak of the user
        bankSold: { type: Number, default: 0 }, // Bank sold of the user

        /* STATS */
        registeredAt: { type: Number, default: Date.now() }, // Registered date of the member

        /* OTHER INFORMATION */
        mute: {
            type: Object,
            default: {
                // The member mute infos
                muted: false,
                case: null,
                endDate: null,
            },
        },
    })
);
export default a;
