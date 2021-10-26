const Card = require("../db/models/Card");
const { sendError } = require("../helpers/functions/Error");

exports.find = (search, projection, options = {}) => Card.find(search, projection, options);

exports.getCards = async(req, res) => {
    try {
        const cards = await this.find();
        return res.json(cards);
    } catch (e) {
        sendError(res, e);
    }
};