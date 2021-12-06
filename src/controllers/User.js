const { sendError } = require("../helpers/functions/Error");

exports.registerAnonymously = (req, res) => {
    try {
        const token = "lol";
        return res.status(200).json({ token });
    } catch (e) {
        sendError(res, e);
    }
};