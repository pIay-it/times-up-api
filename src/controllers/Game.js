const Game = require("../db/models/Game");
const { checkRequestData } = require("../helpers/functions/Express");
const { sendError, generateError } = require("../helpers/functions/Error");

exports.find = (search, projection, options = {}) => Game.find(search, projection, options);

exports.findOne = (search, projection, options = {}) => Game.findOne(search, projection, options);

exports.getFindProjection = query => query.fields ? query.fields.split(",") : null;

exports.getFindOptions = options => ({ limit: options.limit });

exports.getGames = async(req, res) => {
    try {
        const { query } = checkRequestData(req);
        const findProjection = this.getFindProjection(query);
        const findOptions = this.getFindOptions(query);
        const games = await this.find({}, findProjection, findOptions);
        return res.status(200).json(games);
    } catch (e) {
        sendError(res, e);
    }
};

exports.getGame = async(req, res) => {
    try {
        const { params } = checkRequestData(req);
        const game = await this.findOne({ _id: params.id });
        if (!game) {
            throw generateError("NOT_FOUND", `Game not found with ID "${params.id}".`);
        }
        return res.status(200).json(game);
    } catch (e) {
        sendError(res, e);
    }
};