import dotenv from "dotenv";
import mongoose from "mongoose";
import Plex from "./main/Plex";
import { readdir } from "fs";
import { join } from "path";
import axios from "axios";
import * as Sentry from "@sentry/node";
import LogEvents from "./main/Events";
dotenv.config();

const dev = Boolean(process.env.dev);
Sentry.init({ dsn: process.env.dsn });
const client = new Plex(dev, { partials: ["MESSAGE", "CHANNEL", "REACTION"] });

axios.get(`http://localhost:${process.env.PORT || 3000}/`).then((s) => {
    if (s.status !== 200) process.exit(2);
});
/**
 * Starts the bot
 */
const start = async () => {
    console.log(new LogEvents(2).has("JOIN"));
    axios.defaults.validateStatus = () => true;
    readdir(join(__dirname, "./commands"), (_, files: string[]) => {
        client.logger.log(`Loading a total of ${files.length} categories.`, "log");
        files.forEach(async (dir) => {
            readdir(join(__dirname, `./commands/${dir}`), (_, commands: string[]) => {
                commands
                    .filter((cmd) => cmd.split(".").pop() === (dev ? "ts" : "js"))
                    .forEach((cmd) => {
                        const response = client.loadCommand("./commands/" + dir, cmd);
                        if (response) {
                            client.logger.log(response, "error");
                        }
                    });
            });
        });
    });
    // Then we load events, which will include our message and ready event.
    readdir(join(__dirname, "./events"), (_, files: string[]) => {
        client.logger.log(`Loading a total of ${files.length} events.`, "log");
        files.forEach(async (file) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const eventName: any = file.split(".")[0];
            client.logger.log(`Loading Event: ${eventName}`);
            const event = new (require(join(__dirname, `./events/${file}`)))(client);
            client.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(join(__dirname, `./events/${file}`))];
        });
    });

    await client.login(process.env.token);

    mongoose
        .connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            client.logger.log("Connected to the Mongodb database.", "log");
            mongoose.set("useFindAndModify", false);
        })
        .catch((err) => {
            console.error(err);
        });
    const messagesExist = await axios({
        url: `${process.env.elastic}/messages`,
        method: "head",
    });
    const commandsExist = await axios({
        url: `${process.env.elastic}/commands`,
        method: "head",
    });
    if (messagesExist.status === 404) {
        await axios({
            url: `${process.env.elastic}/messages`,
            method: "put",
            data: {
                mappings: {
                    m: {
                        type: "keyword",
                        norms: false,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        index_options: "freqs",
                    },
                    g: {
                        type: "keyword",
                        norms: false,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        index_options: "freqs",
                    },
                    u: {
                        type: "keyword",
                        norms: false,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        index_options: "freqs",
                    },
                    c: {
                        type: "keyword",
                        norms: false,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        index_options: "freqs",
                    },
                    t: {
                        type: "date",
                        norms: false,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        index_options: "freqs",
                    },
                    xp: {
                        type: "boolean",
                        norms: false,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        index_options: "freqs",
                    },
                },
                settings: {
                    codec: "best_compression",
                },
            },
        });
    }
    if (commandsExist.status === 404) {
        await axios({
            url: `${process.env.elastic}/commands`,
            method: "put",
            data: {
                mappings: {
                    c: {
                        type: "keyword",
                        norms: false,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        index_options: "freqs",
                    },
                    a: {
                        type: "keyword",
                        norms: false,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        index_options: "freqs",
                    },
                    g: {
                        type: "keyword",
                        norms: false,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        index_options: "freqs",
                    },
                    t: {
                        type: "date",
                        norms: false,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        index_options: "freqs",
                    },
                },
                settings: {
                    codec: "best_compression",
                },
            },
        });
    }
};

start();
client
    .on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
    .on("error", (e: Error) => client.logger.log(e.message, "error"))
    .on("warn", (info: string) => client.logger.log(info, "warn"))
    .on("debug", (db: string) => client.logger.log(db, "debug"));

process.on("unhandledRejection", (error: Error) => {
    client.logger.log(error.message, "error");
});

process.on("uncaughtException", (error: Error) => {
    client.logger.log(error.message, "error");
});
process.on("exit", (code) => {
    console.log(`About to exit with code: ${code}`);
});
