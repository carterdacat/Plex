import Command from "../../main/Command";
import { Message } from "discord.js";
import Plex from "../../main/Plex";
/**
 * Ban command, bans users
 * @extends Command
 */
module.exports = class extends Command {
    /**
     * @param client
     */
    client: Plex;
    constructor(client: Plex) {
        super(client, {
            name: "ban",
            dirname: __dirname,
            enabled: true,
            description: "Bans the mentioned user.",
        });
    }
    async run(message: Message) {
        if (message.members.mentions.first()) {
            try {
                message.members.mentions.first().ban();
            } catch {
                message.reply("I do not have permissions to ban" + message.members.mentions.first());
        }else {
            message.reply("You do not have permissions to ban" + message.members.mentions.first());
    }
            );
        });
    }
};
