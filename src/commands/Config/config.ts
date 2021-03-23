import Command from "../../main/Command";
import { Message } from "discord.js";
import Plex from "../../main/Plex";
import axios from "axios";
import * as Error from "../../main/Errors";
import { TextChannel } from "discord.js";
module.exports = class extends Command {
    /**
     * @param client
     */
    client: Plex;
    constructor(client: Plex) {
        super(client, {
            name: "config",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Runs through bot configuration",
            usage: "!config",
            examples: "config",
            aliases: [],
            botPermissions: ["ADD_REACTIONS", "SEND_MESSAGES", "USE_EXTERNAL_EMOJIS"],
            memberPermissions: ["ADMINISTRATOR"],
            nsfw: false,
            cooldown: 30000,
        });
    }
    async run(message: Message, args: [string], data) {
        const msg1 = await message.channel.send(
            "This will start the configuation process. Say `start` to start it."
        );
        const responce1: Message | null = await this.client.awaitMessage(
            msg1,
            (m) => m.id === message.author.id,
            15000
        );
        if (!responce1) return message.channel.send("The setup has timeout");
        if (responce1.content.toLowerCase() !== "start")
            return message.channel.send("Ok I wont start it.");
        const msg2 = await message.channel.send(
            "Would you xp to be enabled? It is `on` by default. Answer with yes/no, and type cancel/stop to stop"
        );
        const responce2: Message | null = await this.client.awaitMessage(
            msg2,
            (m) => m.id === message.author.id,
            20000
        );
        if (!responce2) return message.channel.send("The setup has timeout");
        if (responce2.content.toLowerCase() === "cancel" || "stop")
            return message.channel.send("Ok, stopped");
        if (responce2.content.toLowerCase() !== "no" && responce2.content.toLowerCase() !== "yes")
            responce2.channel.send(
                "Hmmm, what you sent didn't match the constraints, so I set it to its default. If you didnt want this, try canceling on the next step"
            );
        if (responce2.content.toLowerCase() === "no") data.guild.xp = false;
        if (responce2.content.toLowerCase() === "no" && responce2.content.toLowerCase() === "yes")
            await responce2.channel.send(`Ok, I turned xp ${data.guild.xp ? "on" : "off"}`);
        const msg3 = await responce2.channel.send(
            "Do you want me to send a message when someone joins the server? Respond with yes, no, or stop/cancel. The default is `no`"
        );
        const responce3: Message | null = await this.client.awaitMessage(
            msg3,
            (m) => m.id === message.author.id,
            15000
        );
        if (!responce3) return message.channel.send("The setup has timeout");
        if (responce3.content.toLowerCase() === "cancel" || "stop")
            return message.channel.send("Ok, stopped");
        if (responce3.content.toLowerCase() !== "no" && responce3.content.toLowerCase() !== "yes")
            await responce3.channel.send(
                "Hmmm, what you sent didn't match the constraints, so I set it to its default. If you didnt want this, try canceling on the next step"
            );
        if (responce3.content.toLowerCase()) {
            const msg3channel = await responce3.channel.send(
                "Ok, I enabled it. What channel would you like this to be in? Please mention a channel, anything else and I will disable it."
            );
            const responce3channel: Message | null = await this.client.awaitMessage(
                msg3channel,
                (m) => m.id === message.author.id,
                15000
            );
            const channel: TextChannel = await this.client.resolveChannel({
                guild: message.guild,
                search: responce3channel.content,
                channelType: "text",
            });
            if (channel) {
                if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
                    return message.channel.send("I can't talk their, so I have disabled this.");
                data.guild.welcome = channel.id;
                const msg3message = await msg3.channel.send(
                    `Ok, I will send it to <#${channel.id}>. Do you want to send a custom message? Type no if not, or the custom message if yes`
                );
                const responce3message = await this.client.awaitMessage(
                    msg3message,
                    (m) => m.id === message.author.id,
                    15000
                );
                if (!responce3message) message.channel.send("No responce, using defaults.");
                if (responce3message.content.toLowerCase() === "no")
                    message.channel.send("Ok, I will use the defaults");
                if (responce3message.content.toLowerCase() !== "no" && responce3message) {
                    data.guild.welcomeMessage = responce3message;
                    message.channel.send("OK, I'll use that");
                }
            } else {
                msg3channel.channel.send(
                    "Hmm that isn a valid, so I have disabled the welcome message."
                );
            }
            await axios({
                method: "put",
                url: `http://localhost:${process.env.PORT || 3000}/guild`,
                params: {
                    id: message.guild.id,
                },
                data: data.guild,
            });
            message.channel.send("Your all set! Have fun.");
        }
    }
};
