import axios from "axios";

const findOrCreateUser = async ({ id: id }) => {
    return new Promise(async (res) => {
        const data = await axios({
            method: "get",
            url: `http://localhost:${process.env.PORT || 3000}/user`,
            params: {
                id: id,
            },
        });
        if (data.status === 200) {
            return res(data.data);
        } else {
            const newData = await axios({
                method: "post",
                url: `http://localhost:${process.env.PORT || 3000}/user`,
                params: {
                    id: id,
                },
            });
            if (newData.status !== 200) return res(null);
            return res(newData.data);
        }
    });
};
export default findOrCreateUser;
