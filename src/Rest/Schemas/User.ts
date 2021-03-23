import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    /* REQUIRED */
    id: { type: String }, // Discord ID of the user
    /* ECONOMY (GLOBAL) */
    rep: { type: Number, default: 0 }, // Reputation points of the user
    birthdate: { type: Number }, // Birthdate of the user (the timestamp)
    /* STATS */
    registeredAt: { type: Number, default: Date.now() }, // Registered date of the user
    /* OTHER INFORMATIONS */
    afk: { type: String, default: null }, // Whether the member is AFK
    levelColor: { type: String, default: "#000000" },
});
const a = mongoose.model("User", userSchema);
export default a;
