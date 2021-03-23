import Command from "../../main/Command";
import Plex from "../../main/Plex";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import cp from "child_process";
import { convertMs } from "../../utils/functions";

/**
 * Ping command, Gets ping
 * @extends Command
 */
module.exports = class extends Command {
    /**
     * @param client
     */
    client: Plex;

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
    }

    async run(message: Message, args: [string]) {
        const command = args.join(" ");
        if (!command) return message.channel.send("Nothing to execute");
        const startTime = Date.now();
        cp.exec(command, { timeout: 10000 }, (err, stdout, stderr) => {
            if (err) {
                if (stderr.length > 5900 || err.name.length > 256) {
                    return message.channel.send(
                        "its TO BIG DADDY! Anywho, i loged it into the console instead of sending a mesaage to you"
                    );
                }
                if ((err.signal = "SIGTERM")) {
                    const errEmbed = new MessageEmbed()
                        .setColor("")
                        .setAuthor(`${message.author.tag} | Error`)
                        .setTitle(`:x: ${err.name}`)
                        .setDescription(stdout)
                        .setFooter(this.client.version)
                        .setTimestamp();
                    return message.channel.send(errEmbed);
                }
                const errEmbed = new MessageEmbed()
                    .setColor("")
                    .setAuthor(`${message.author.tag} | Error`)
                    .setTitle(`:x: Error: ${err.name}`)
                    .setDescription(`\`\`\`${stderr}\`\`\``)
                    .setFooter(this.client.version)
                    .setTimestamp();
                return message.channel.send(errEmbed);
            }
            if (stdout.length > 5900) {
                console.log(stdout);
                return message.channel.send(
                    "its TO BIG DADDY! Anywho, i loged it into the console instead of sending a mesaage to you"
                );
            }
            const duration = convertMs(new Date(Date.now() - startTime).getMilliseconds());
            const embed = new MessageEmbed()
                .setColor("#00000")
                .setAuthor(`${message.author.tag} | Exec`)
                .setTitle(`:white_check_mark: Success!`)
                .setDescription(`\`\`\`${stdout}\`\`\``)
                .setFooter(this.client.version + " - " + duration)
                .setTimestamp();
            message.channel.send(embed);
        });
    }
};
