import DBL from "dblapi.js";
/**
 * Starts to post stats to DBL
 * @param {object} client The Discord Client instance
 */
const init = (client) => {
    if (client.config.dbl && client.config.dbl !== "") {
        const stats = new DBL(client.config.apiKeys.dbl, client);
        setInterval(async function () {
            await stats.postStats(client.guilds.cache.size);
        }, 60000 * 10); // every 10 minutes
    }
};
export default init;
