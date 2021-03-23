import table from "markdown-table";
import Plex from "../main/Plex";
import path, { join } from "path";
import fs, { readdir } from "fs";

/**
 * Update the doc
 * @param {object} client The Discord Client instance
 */
const update = async (client: Plex) => {
    const commands = client.commands;
    const categories = [];
    commands.forEach((cmd) => {
        if (!categories.includes(cmd.help.category)) {
            categories.push(cmd.help.category);
        }
    });
    let text = `# Commands  \nHere's the list of Plex's commands! \n\n#### Contents of the table  \n**Name**: The name of the command  \n**Description**: A brief explanation of the purpose of the command  \n**Usage**: The arguments/options that the command takes in parameters  \n **Aliases** Other commands names that will run the same command \n**Cooldown**: The time that must elapse between each command so that it can be executed again by the user\n\n`;

    categories
        .sort(function (a, b) {
            const aCmdsLength = commands.filter((cmd) => cmd.help.category === a).array().length;
            const bCmdsLength = commands.filter((cmd) => cmd.help.category === b).array().length;
            if (aCmdsLength > bCmdsLength) {
                return -1;
            } else {
                return 1;
            }
        })
        .forEach((cat) => {
            const arrCat = [["Name", "Description", "Usage", "Aliases", "Cooldown"]];
            const cmds = commands.filter((cmd) => cmd.help.category === cat).array();
            text += `### ${cat} (${cmds.length} commands)\n\n`;
            cmds.sort(function (a, b) {
                if (a.help.name < b.help.name) {
                    return -1;
                } else {
                    return 1;
                }
            }).forEach((cmd) => {
                const newUsage = cmd.help.usage.replace(/</g, "\\<");
                let newAliases;
                if (cmd.conf.aliases && cmd.conf.aliases.length > 0) {
                    newAliases = cmd.conf.aliases.join(", ");
                }
                arrCat.push([
                    `**${cmd.help.name}**`,
                    `${cmd.help.description}`,
                    `${newUsage}`,
                    `${newAliases ? newAliases : "None"}`,
                    Math.ceil((cmd.conf.cooldown ? cmd.conf.cooldown : 30000) / 1000) + " seconds",
                ]);
            });
            text += `${table(arrCat)}\n\n`;
        });
    fs.writeFileSync(join(__dirname, `../../docs/commands.md`), text);
    client.logger.log("Docs updated!");
};
export default update;
