const Card = require("../db/models/Card");
const { checkRequestData } = require("../helpers/functions/Express");
const { sendError, generateError } = require("../helpers/functions/Error");

exports.find = (search, projection, options = {}) => Card.find(search, projection, options);

exports.findOne = (search, projection, options = {}) => Card.findOne(search, projection, options);

exports.getCards = async(req, res) => {
    try {
        const cards = await this.find();
        return res.status(200).json(cards);
    } catch (e) {
        sendError(res, e);
    }
};

exports.getCard = async(req, res) => {
    try {
        const { params } = checkRequestData(req);
        const card = await this.findOne({ _id: params.id });
        if (!card) {
            throw generateError("NOT_FOUND", `Card not found with ID "${params.id}".`);
        }
        return res.status(200).json(card);
    } catch (e) {
        sendError(res, e);
    }
};