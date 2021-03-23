import axios from "axios";
import findOrCreateGuild from "./findOrCreateGuild";

const findOrCreateMember = async ({ id: id, guildID }) => {
    return new Promise(async (res) => {
        const data = await axios({
            method: "get",
            url: `http://localhost:${process.env.PORT || 3000}/member`,
            params: {
                id: id,
                guildID: guildID,
            },
        });
        if (data.status === 200) {
            return res(data.data);
        } else {
            const newData = await axios({
                method: "post",
                url: `http://localhost:${process.env.PORT || 3000}/member`,
                params: {
                    id: id,
                    guildID: guildID,
                },
            });
            if (newData.status !== 200) return res(null);
            await findOrCreateGuild({ id: guildID });
            return res(newData.data);
        }
    });
};
export default findOrCreateMember;
