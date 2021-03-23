import parser from "body-parser";
import express from "express";
import * as user from "./controllers/user.ts";
import * as member from "./controllers/member.ts";
import * as guild from "./controllers/guild.ts";
import dotenv from "dotenv";
import logger from "./logger.mjs";
import mongoose from "mongoose";

dotenv.config();

const app = new express();

const Logger = new logger();

mongoose
    .connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        Logger.log("Connected to the Mongodb database.", "log");
        mongoose.set("useFindAndModify", false);
    })
    .catch((err) => {
        console.error(err);
    });

app.set("port", process.env.PORT || "3000");
app.listen(app.get("port"), () => {
    Logger.log("Rest API ready");
});
app.get("/", parser.json(), (req, res) => {
    return res.send("A-ok");
});
app.post("/user", user.createUser);
app.get("/user", user.findUser);
app.put("/user", parser.json(), user.updateUser);
app.delete("/user", user.deleteUser);
app.post("/member", member.createMember);
app.get("/member", member.findMember);
app.put("/member", parser.json(), member.updateMember);
app.delete("/member", member.deleteMember);
app.post("/guild", guild.createGuild);
app.get("/guild", guild.findGuild);
app.put("/guild", parser.json(), guild.updateGuild);
app.delete("/guild", guild.deleteGuild);
app.get("/canvas", parser.json(), () => {
    return "Canvas";
});
app.get("/member/mutes", parser.json(), member.findAllMutes);
