import Plex from "../main/Plex";

module.exports = class {
    client: Plex;
    constructor(client: Plex) {
        this.client = client;
    }

    async run(message) {
    }
};
