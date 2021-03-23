import axios from "axios";

const findOrCreateGuild = async ({ id: guildID }) => {
    return new Promise(async (res) => {
        const data = await axios({
            method: "get",
            url: `http://localhost:${process.env.PORT || 3000}/guild`,
            params: {
                id: guildID,
            },
        });
        if (data.status === 200) {
            return res(data.data);
        } else {
            const newData = await axios({
                method: "post",
                url: `http://localhost:${process.env.PORT || 3000}/guild`,
                params: {
                    id: guildID,
                },
            });
            if (newData.status !== 200) return res(null);
            return res(newData.data);
        }
    });
};
export default findOrCreateGuild;
