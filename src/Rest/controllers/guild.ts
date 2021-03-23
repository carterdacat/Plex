import Logger from "../../main/logger";
import Guild from "../Schemas/Guild";
const logger = new Logger();
export const createGuild = async (req, res) => {
    logger.log(`POST Request made at ${req.originalUrl}`, "rest");
    if (!req.query.id) return res.status(400).send("Invalid Guild ID");
    const user = await Guild.findOne({ id: req.query.id });
    if (user) return res.status(200).send(user);
    Guild.create({ id: req.query.id })
        .then((data) => {
            return res.status(200).send(data);
        })
        .catch((e) => {
            return res.status(500).send(e);
        });
};
// create guild will create a simple guild with just the id and defaults
// POST Method

export const findGuild = async (req, res) => {
    logger.log(`GET Request made at ${req.originalUrl}`, "rest");
    if (!req.query.id) return res.status(400).send("Invalid Guild ID");
    const user = await Guild.findOne({ id: req.query.id }).populate("members");
    if (user) return res.status(200).send(user);
    return res.status(404).send("No data found from the requested Guild ID");
};
//GET Method

export const deleteGuild = async (req, res) => {
    logger.log(`DELETE Request made at ${req.originalUrl}`, "rest");
    if (!req.query.id) return res.status(400).send("Invalid Guild ID");
    const userCheck = await Guild.findOne({ id: req.query.id });
    if (!userCheck) return res.status(200).send("No data found from the requested Guild ID");
    await Guild.deleteOne({ id: req.query.id }, (e) => {
        if (!e) {
            return res.status(200).send("Successfully Deleted the Guild");
        } else return res.status(500).send("Internal Server Error");
    });
};
//DELETE Method

export const updateGuild = async (req, res) => {
    logger.log(`PUT Request made at ${req.originalUrl}`, "rest");
    if (!req.query.id) return res.status(400).send("Invalid Guild ID");
    const userCheck = await Guild.findOne({ id: req.query.id });
    if (req.body._id) delete req.body._id;
    if (!userCheck) return res.status(404).send("No data found from the requested Guild ID");
    const data = await Guild.findOneAndUpdate({ id: req.query.id }, req.body, { new: true });
    await data.save();
    if (!data) res.status(500).send("Internal Server Error");
    return res.status(200).send(data);
};
// PUT Method
