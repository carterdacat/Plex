import Command from "../../main/Command";
import Plex from "../../main/Plex";
import util from "util";
import discord from "discord.js";
import tags from "common-tags";
const nl = "!!NL!!";
const nlPattern = new RegExp(nl, "g");
/**
 * Ping command, Gets ping
 * @extends Command
 */
module.exports = class extends Command {
    /**
     * @param client
     */
    client: Plex;
    lastResult: any;
    hrStart: [number, number];
    private _sensitivePattern: any;

    constructor(client: Plex) {
        super(client, {
            name: "cp",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            description: "Dev command that emeulated a second terminal",
            usage: "N/A",
            examples: "",
            aliases: [],
            botPermissions: ["ADD_REACTIONS", "SEND_MESSAGES", "USE_EXTERNAL_EMOJIS"],
            memberPermissions: ["ADMINISTRATOR"],
            nsfw: false,
            cooldown: 3000,
        });

        this.lastResult = null;
        Object.defineProperty(this, "_sensitivePattern", { value: null, configurable: true });
    }

    async run(msg: discord.Message, args: [string]) {
        // Make a bunch of helpers
        /* eslint-disable no-unused-vars */
        const message = msg;
        const client = msg.client;
        const lastResult = this.lastResult;
        const doReply = (val) => {
            if (val instanceof Error) {
                msg.reply(`Callback error: \`${val}\``);
            } else {
                const result = this.makeResultMessages(val, process.hrtime(this.hrStart));
                if (Array.isArray(result)) {
                    for (const item of result) msg.reply(item);
                } else {
                    msg.reply(result);
                }
            }
        };
        /* eslint-enable no-unused-vars */
        if (!args) return;
        // Run the code and measure its execution time
        let hrDiff;
        try {
            const hrStart = process.hrtime();
            this.lastResult = eval(args.join(" "));
            hrDiff = process.hrtime(hrStart);
        } catch (err) {
            return msg.reply(`Error while evaluating: \`${err}\``);
        }
        // Prepare for callback time and respond
        this.hrStart = process.hrtime();
        const result = this.makeResultMessages(this.lastResult, hrDiff, args.join(" "));
        if (Array.isArray(result)) {
            return result.map((item) => msg.reply(item));
        } else {
            return msg.reply(result);
        }
    }

    makeResultMessages(result, hrDiff, input = null) {
        const inspected = util
            .inspect(result, { depth: 0 })
            .replace(nlPattern, "\n")
            .replace(this.sensitivePattern, "--snip--");
        const split = inspected.split("\n");
        const last = inspected.length - 1;
        const prependPart =
            inspected[0] !== "{" && inspected[0] !== "[" && inspected[0] !== "'"
                ? split[0]
                : inspected[0];
        const appendPart =
            inspected[last] !== "}" && inspected[last] !== "]" && inspected[last] !== "'"
                ? split[split.length - 1]
                : inspected[last];
        const prepend = `\`\`\`javascript\n${prependPart}\n`;
        const append = `\n${appendPart}\n\`\`\``;
        if (input) {
            return discord.Util.splitMessage(
                tags.stripIndents`
				*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`,
                { maxLength: 1900, prepend, append }
            );
        } else {
            return discord.Util.splitMessage(
                tags.stripIndents`
				*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`,
                { maxLength: 1900, prepend, append }
            );
        }
    }
    get sensitivePattern() {
        if (!this._sensitivePattern) {
            const client = this.client;
            let pattern = "";
            if (client.token) pattern += this.client.escapeRegex(client.token);
            Object.defineProperty(this, "_sensitivePattern", {
                value: new RegExp(pattern, "gi"),
                configurable: false,
            });
        }
        return this._sensitivePattern;
    }
};
