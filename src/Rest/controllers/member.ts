import Logger from "../../main/logger";
import Member from "../Schemas/Member";
const logger = new Logger();
export const createMember = async (req, res) => {
    logger.log(`POST Request made at ${req.originalUrl}`, "rest");
    if (!req.query.id || !req.query.guildID)
        return res.status(400).send("Invalid Member ID, or Guild ID");
    const user = await Member.findOne({ guildID: req.query.guildID, id: req.query.id });
    if (user) return res.status(200).send(user);
    Member.create({ guildID: req.query.guildID, id: req.query.id })
        .then((data) => {
            return res.status(200).send(data);
        })
        .catch((e) => {
            return res.status(500).send(e);
        });
};
// create user will create a simple user with just the id and defaults
// POST Method

export const findMember = async (req, res) => {
    logger.log(`GET Request made at ${req.originalUrl}`, "rest");
    if (!req.query.id || !req.query.guildID)
        return res.status(400).send("Invalid Member ID, or Guild ID");
    const user = await Member.findOne({ guildID: req.query.guildID, id: req.query.id });
    if (user) return res.status(200).send(user);
    return res.status(404).send("No data found from the requested User ID");
};
//GET Method

export const deleteMember = async (req, res) => {
    logger.log(`DELETE Request made at ${req.originalUrl}`, "rest");
    if (!req.query.id || !req.query.guildID)
        return res.status(400).send("Invalid Member ID, or Guild ID");
    const userCheck = await Member.findOne({
        id: req.query.id,
        guildID: req.query.guildID,
    });
    if (!userCheck) return res.status(200).send("No data found from the requested User ID");
    await Member.deleteOne({ id: req.query.id, guildID: req.query.guildID }, (e) => {
        if (!e) {
            return res.status(200).send("Successfully Deleted the User");
        } else return res.status(500).send(e);
    });
};
//DELETE Method

export const updateMember = async (req, res) => {
    logger.log(`PUT Request made at ${req.originalUrl}`, "rest");
    if (!req.query.id || !req.query.guildID) return res.status(400).send("Invalid User ID");
    const userCheck = await Member.findOne({
        id: req.query.id,
        guildID: req.query.guildID,
    });
    if (!userCheck) res.status(404).send("No data found from the requested User ID");
    const data = await Member.findOneAndUpdate(
        { id: req.query.id, guildID: req.query.guildID },
        req.body,
        { new: true }
    );
    await data.save();
    if (!data) res.status(500).send("Internal Server Error");
    return res.status(200).send(data);
};
// PUT Method

export const findAllMutes = async (req, res) => {
    logger.log(`GET request made for all muted users`, "rest");
    const muteds = await Member.find({ "mute.muted": true });
    return res.status(200).send(muteds);
};
