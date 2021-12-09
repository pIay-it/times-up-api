const uniqid = require("uniqid");
const { sign: signJWT } = require("jsonwebtoken");
const { sendError } = require("../helpers/functions/Error");
const Config = require("../../config");

exports.getJWT = payload => signJWT(payload, Config.app.routes.auth.JWT.privateKey);

exports.registerAnonymously = (req, res) => {
    try {
        const token = this.getJWT({ mode: "anonymous", userId: uniqid("anonymous-") });
        return res.status(200).json({ token });
    } catch (e) {
        sendError(res, e);
    }
};