import Plex from "../main/Plex";
import { MessageEmbed, TextChannel } from "discord.js";
import axios from "axios";
/**
 * Starts communicating with [DBL](https://top.gg/api/docs?__cf_chl_jschl_tk__=e2203c7da30d32bc27f4fcd11f2181a130bbb9d6-1601341666-0-AQNL8KaGU-yAIDferP_JK-KapLDp3xk_6Sj_l6JCLx_-DO4XCaGfSDq-l7MtAejrjvcB__qX30bzr2ifqSDfBGtsEMcLrx2oVI9DYCmEHniRHuvAcW3Vp4105pYd3ltJEhFrJBZvntMvXVj5x4b4bsLJ9AcddhxhjC1kibodolzviHr1Nng5ei1wiV133TRb-uLZDVvB_A9k4xTxmsne1PIZYcgWZSV6PugUuBeLObHYs2glR4sVM91xDwOIMHvZkDtud0lF8w6o7KiazaNH0wHu_b_Irp5JBaFGHcVVKUvW#jslib)
 * @param {object} client The Discord Client instance
 */
const dblStart = async (client: Plex) => {
    axios({
        url: `http://localhost:${process.env.PORT || 3000}/member/mutes`,
        method: "get",
    }).then((muteds) => {
        muteds.data.forEach((mutedUser: any) => {
            client.muted.set(`${mutedUser.id}${mutedUser.guildID}`, mutedUser);
        });
    });
    setInterval(async () => {
        for (const u of client.muted
            .array()
            .filter((user) => user.mute.endDate <= Date.now() && user.mute.endDate)) {
            const guild = client.guilds.cache.get(u.guildID);
            if (!guild) return;
            const member =
                guild.members.cache.get(u.id) ||
                (await guild.members.fetch(u.id).catch(async () => {
                    u.mute = {
                        muted: false,
                        endDate: null,
                        case: null,
                    };
                    await axios({
                        url: `http://localhost:${process.env.PORT || 3000}/member`,
                        method: "post",
                        params: {
                            id: u.id,
                            guildID: u.guildID,
                        },
                        data: u,
                    });
                    client.logger.log("[unmute] " + u.id + " cannot be found.");
                    return null;
                }));
            const guildData = await client.findOrCreateGuild({ id: guild.id });
            if (member) {
                guild.channels.cache.forEach((channel) => {
                    const permOverwrites = channel.permissionOverwrites.get(member.id);
                    if (permOverwrites) permOverwrites.delete();
                });
            }
            const user = member ? member.user : await client.users.fetch(u.id);
            const embed = new MessageEmbed();
            embed
                .setColor(guildData.embedColor)
                .setDescription("You have been successfully unmuted in " + guild.name)
                .setFooter(client.version)
                .setTimestamp();
            const log = new MessageEmbed();
            log.setColor(guildData.embedColor)
                .setDescription(`${user.tag} has been unmuted`)
                .setFooter(client.version)
                .setTimestamp();
            await user.send(embed).catch();
            if (guildData.logs.unmute) {
                const logChan = (await client.channels.fetch(guildData.logs.unmute)) as TextChannel;
                await logChan.send(log);
            }
            u.mute = {
                muted: false,
                endDate: null,
                case: null,
            };
            client.muted.delete(`${u.id}${u.guildID}`);
            await axios({
                url: `http://localhost:${process.env.PORT || 3000}/member`,
                method: "put",
                params: {
                    id: u.id,
                    guildID: u.guildID,
                },
                data: u,
            });
        }
    }, 1000);
};
export default init;
