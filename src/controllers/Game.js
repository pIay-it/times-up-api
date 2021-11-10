const { sampleSize } = require("lodash");
const { flatten } = require("mongo-dot-notation");
const Game = require("../db/models/Game");
const Card = require("./Card");
const { checkRequestData } = require("../helpers/functions/Express");
const { sendError, generateError } = require("../helpers/functions/Error");

exports.find = (search, projection, options = {}) => Game.find(search, projection, options);

exports.findOne = (search, projection, options = {}) => Game.findOne(search, projection, options);

exports.findOneAndUpdate = async(search, data, options = {}) => {
    const { toJSON } = options;
    delete options.toJSON;
    options.new = options.new === undefined ? true : options.new;
    const existingGame = await this.findOne(search);
    if (!existingGame) {
        throw generateError("GAME_NOT_FOUND", `Game not found.`);
    }
    const updatedGame = await Game.findOneAndUpdate(search, flatten(data), options);
    return toJSON ? updatedGame.toJSON() : updatedGame;
};

exports.findOneAndDelete = async search => {
    const game = await this.findOne(search);
    if (!game) {
        throw generateError("GAME_NOT_FOUND", `Game not found.`);
    }
    await Game.deleteOne(search);
    return game;
};

exports.getRandomCards = async() => {
    const cards = await Card.find({}, "-createdAt -updatedAt");
    return sampleSize(cards, 40);
};

exports.fillPlayersTeam = players => players.forEach((player, index) => {
    player.team = index % 2 ? "Rouge" : "Bleue";
});

exports.checkUniqueNameInPlayers = players => {
    const playerNameSet = [...new Set(players.map(({ name }) => name))];
    if (playerNameSet.length !== players.length) {
        throw generateError("PLAYERS_NAME_NOT_UNIQUE", "Players don't all have unique name.");
    }
};

exports.checkAndFillPlayersData = players => {
    this.checkUniqueNameInPlayers(players);
    this.fillPlayersTeam(players);
};

exports.checkAndFillDataBeforeCreate = async data => {
    this.checkAndFillPlayersData(data.players);
    data.cards = await this.getRandomCards(data.options);
};

exports.create = async(data, options = {}) => {
    await this.checkAndFillDataBeforeCreate(data);
    const { toJSON } = options;
    delete options.toJSON;
    if (!Array.isArray(data)) {
        options = null;
    }
    const game = await Game.create(data, options);
    return toJSON ? game.toJSON() : game;
};

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
            throw generateError("GAME_NOT_FOUND", `Game not found with ID "${params.id}".`);
        }
        return res.status(200).json(game);
    } catch (e) {
        sendError(res, e);
    }
};

exports.postGame = async(req, res) => {
    try {
        const { body } = checkRequestData(req);
        const game = await this.create(body);
        return res.status(200).json(game);
    } catch (e) {
        sendError(res, e);
    }
};

exports.patchGame = async(req, res) => {
    try {
        const { body, params } = checkRequestData(req);
        const game = await this.findOneAndUpdate({ _id: params.id }, body);
        return res.status(200).json(game);
    } catch (e) {
        sendError(res, e);
    }
};

exports.deleteGame = async(req, res) => {
    try {
        const { params } = checkRequestData(req);
        const game = await this.findOneAndDelete({ _id: params.id });
        return res.status(200).json(game);
    } catch (e) {
        sendError(res, e);
    }
};

exports.checkGamePlayCardsData = ({ cards }, game) => {
    const cardsIdSet = [...new Set(cards.map(({ _id }) => _id))];
    if (cardsIdSet.length !== cards.length) {
        throw generateError("CANT_PLAY_CARD_TWICE", "One or more cards are played twice in the same play.");
    }
    for (const card of cards) {
        const cardInGame = game.cards.find(({ _id }) => _id.toString() === card._id.toString());
        if (!cardInGame) {
            throw generateError("CARD_NOT_IN_GAME", `Card with ID "${card._id}" not found in game with ID "${game._id}".`);
        } else if (cardInGame.status === "guessed") {
            throw generateError("CARD_ALREADY_GUESSED", `Card with ID "${card._id}" was already guessed before.`);
        } else if (card.status === "skipped" && game.round === 1) {
            throw generateError("CANT_SKIP_CARD", `Card with ID "${card._id}" can't be skipped because game's round is 1.`);
        }
    }
};

exports.checkGamePlayData = (data, game) => {
    if (!game) {
        throw generateError("GAME_NOT_FOUND", `Game not found with ID "${data.gameId}".`);
    } else if (game.status !== "playing") {
        throw generateError("GAME_NOT_PLAYING", `Game with ID "${game._id}" doesn't have the "playing" status, plays are not allowed.`);
    }
    if (data.cards) {
        this.checkGamePlayCardsData(data, game);
    }
};

exports.postPlay = async(req, res) => {
    try {
        const { params, body } = checkRequestData(req);
        body.gameId = params.id;
        const game = await this.findOne({ _id: params.id });
        this.checkGamePlayData(body, game);
        return res.status(200).json(game);
    } catch (e) {
        sendError(res, e);
    }
};