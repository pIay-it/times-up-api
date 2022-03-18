const { sampleSize } = require("lodash");
const { flatten } = require("mongo-dot-notation");
const camelCase = require("camelcase");
const Game = require("../db/models/Game");
const Card = require("./Card");
const { checkRequestData } = require("../helpers/functions/Express");
const { deleteProperties } = require("../helpers/functions/Object");
const { getAuthStrategyFromReq } = require("../helpers/functions/Passport");
const { sendError, generateError } = require("../helpers/functions/Error");

exports.find = (search, projection, options = {}) => Game.find(search, projection, options);

exports.findOne = (search, projection, options = {}) => Game.findOne(search, projection, options);

exports.checkDataBeforeUpdate = async(search, data, options) => {
    const existingGame = await this.findOne(search);
    if (!existingGame) {
        throw generateError("GAME_NOT_FOUND", `Game not found.`);
    } else if (getAuthStrategyFromReq(options?.req) === "JWT") {
        const unUpdatableGameStatuses = ["over", "canceled"];
        const allowedNewStatuses = ["playing", "canceled"];
        if (unUpdatableGameStatuses.includes(existingGame.status)) {
            throw generateError("GAME_NOT_UPDATABLE", `Game with ID "${existingGame._id}" is in status "${existingGame.status}" and so can't be updated by JWT user anymore.`);
        } else if (data?.status && !allowedNewStatuses.includes(data.status)) {
            throw generateError("FORBIDDEN_NEW_GAME_STATUS", `JWT users can't update a game status for "${data.status}".`);
        }
    }
    existingGame.checkBelongsToUserFromReq(options.req);
};

exports.findOneAndUpdate = async(search, data, options = {}) => {
    const { toJSON } = options;
    delete options.toJSON;
    options.new = options.new === undefined ? true : options.new;
    await this.checkDataBeforeUpdate(search, data, options);
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
    const sample = sampleSize(cards, 40);
    sample.forEach(card => {
        card.set("status", "to-guess");
    });
    return sample;
};

exports.fillPlayersTeam = (players, teams) => players.forEach((player, index) => {
    player.team = index % 2 ? teams[0].name : teams[1].name;
});

exports.checkUniqueNameInPlayers = players => {
    const playerNameSet = [...new Set(players.map(({ name }) => name))];
    if (playerNameSet.length !== players.length) {
        throw generateError("PLAYERS_NAME_NOT_UNIQUE", "Players don't all have unique name.");
    }
};

exports.checkAndFillPlayersData = (players, teams) => {
    this.checkUniqueNameInPlayers(players);
    this.fillPlayersTeam(players, teams);
};

exports.getGameTeams = () => [
    {
        name: "Jaune",
        color: "#FFE41D",
    }, {
        name: "Bleue",
        color: "#07ABFF",
    },
];

exports.checkAndFillUserData = async data => {
    const { user } = data;
    delete data.user;
    if (getAuthStrategyFromReq({ user }) === "JWT") {
        const { _id, mode } = user;
        const onGoingGameUserSearch = mode === "anonymous" ? { anonymousUser: { _id } } : { user: _id };
        if (await this.findOne({ ...onGoingGameUserSearch, status: { $in: ["preparing", "playing"] } })) {
            throw generateError("USER_HAS_ON_GOING_GAMES", `User with id "${_id}" already has at least one game in "preparing" or "playing" status.`);
        } else if (mode === "anonymous") {
            data.anonymousUser = { _id };
        }
    }
};

exports.checkAndFillDataBeforeCreate = async data => {
    await this.checkAndFillUserData(data);
    data.teams = this.getGameTeams();
    this.checkAndFillPlayersData(data.players, data.teams);
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
    game.set("queue", game.firstQueue);
    game.set("speaker", game.nextSpeaker);
    game.rollQueue();
    await game.save();
    return toJSON ? game.toJSON() : game;
};

exports.getFindSearch = (query, req) => {
    const searchFieldsFromQuery = ["status"];
    const search = {};
    for (const field in query) {
        if (field === "anonymous-user-id") {
            search.anonymousUser = { _id: query[field] };
        } else if (searchFieldsFromQuery.includes(field)) {
            search[camelCase(field)] = query[field];
        }
    }
    if (getAuthStrategyFromReq(req) === "JWT") {
        if (req.user.mode === "anonymous") {
            search.anonymousUser = { _id: req.user._id };
        } else {
            search.user = req.user._id;
        }
    }
    return search;
};

exports.getFindProjection = query => query.fields ? query.fields.split(",") : null;

exports.getFindOptions = options => ({
    limit: options.limit,
    sort: { [options["sort-by"]]: options.order },
});

exports.getGames = async(req, res) => {
    try {
        const { query } = checkRequestData(req);
        const findSearch = this.getFindSearch(query, req);
        const findProjection = this.getFindProjection(query);
        const findOptions = this.getFindOptions(query);
        const games = await this.find(findSearch, findProjection, findOptions);
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
        game.checkBelongsToUserFromReq(req);
        return res.status(200).json(game);
    } catch (e) {
        sendError(res, e);
    }
};

exports.postGame = async(req, res) => {
    try {
        const { body } = checkRequestData(req);
        const game = await this.create({ ...body, user: req.user });
        return res.status(200).json(game);
    } catch (e) {
        sendError(res, e);
    }
};

exports.patchGame = async(req, res) => {
    try {
        const { body, params } = checkRequestData(req);
        const game = await this.findOneAndUpdate({ _id: params.id }, body, { req });
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

exports.checkGamePlayCardData = (cardInGame, card, game) => {
    if (!cardInGame) {
        throw generateError("CARD_NOT_IN_GAME", `Card with ID "${card._id}" not found in game with ID "${game._id}".`);
    } else if (cardInGame.status === "guessed") {
        throw generateError("CARD_ALREADY_GUESSED", `Card with ID "${card._id}" was already guessed before.`);
    } else if (card.status === "skipped" && game.round === 1) {
        throw generateError("CANT_SKIP_CARD", `Card with ID "${card._id}" can't be skipped because game's round is 1.`);
    }
};

exports.checkAndFillGamePlayCardsData = ({ cards }, game) => {
    const cardsIdSet = [...new Set(cards.map(({ _id }) => _id))];
    if (cardsIdSet.length !== cards.length) {
        throw generateError("CANT_PLAY_CARD_TWICE", "One or more cards are played twice in the same play.");
    }
    for (const [index, card] of cards.entries()) {
        const cardInGame = game.getCardById(card._id);
        this.checkGamePlayCardData(cardInGame, card, game);
        if (card.status === "guessed") {
            cardInGame.set("status", "guessed");
            cardInGame.set("playingTime", card.playingTime);
        }
        cards[index] = { ...cardInGame.toJSON(), ...card };
        deleteProperties(cards[index], ["createdAt", "updatedAt"]);
    }
};

exports.checkAndFillGamePlayData = (play, game, user) => {
    if (!game) {
        throw generateError("GAME_NOT_FOUND", `Game not found with ID "${play.gameId}".`);
    }
    game.checkBelongsToUserFromReq({ user });
    if (game.status !== "playing") {
        throw generateError("GAME_NOT_PLAYING", `Game with ID "${game._id}" doesn't have the "playing" status, plays are not allowed.`);
    }
    if (play.cards) {
        this.checkAndFillGamePlayCardsData(play, game);
    }
};

exports.play = async(play, user) => {
    const game = await this.findOne({ _id: play.gameId });
    this.checkAndFillGamePlayData(play, game, user);
    game.unshiftHistoryEntry(play);
    if (game.isRoundOver) {
        game.pushSummaryRound();
        if (game.isOver) {
            game.set("status", "over");
            game.setFinalSummary();
        } else {
            game.set("round", game.round + 1);
            game.set("turn", 1);
            game.resetCardsForNewRound();
            game.shuffleCards(false);
        }
    } else {
        game.set("turn", game.turn + 1);
        game.shuffleCards(true);
    }
    if (game.status !== "over") {
        game.setNextSpeakerAndRollQueue();
    }
    return game.save();
};

exports.postPlay = async(req, res) => {
    try {
        const { params, body } = checkRequestData(req);
        const game = await this.play({ ...body, gameId: params.id }, req.user);
        return res.status(200).json(game);
    } catch (e) {
        sendError(res, e);
    }
};

exports.shuffleCards = async(gameId, user) => {
    const game = await this.findOne({ _id: gameId });
    const allowedGameStatuses = ["preparing", "playing"];
    if (!game) {
        throw generateError("GAME_NOT_FOUND", `Game not found with ID "${gameId}".`);
    }
    game.checkBelongsToUserFromReq({ user });
    if (!allowedGameStatuses.includes(game.status)) {
        throw generateError("CANT_SHUFFLE_CARDS", `Game with ID "${gameId}" doesn't have the "preparing" or "playing" status, cards shuffles are not allowed.`);
    }
    game.shuffleCards(false);
    return game.save();
};

exports.postShuffleCards = async(req, res) => {
    try {
        const { params } = checkRequestData(req);
        const game = await this.shuffleCards(params.id, req.user);
        return res.status(200).json(game);
    } catch (e) {
        sendError(res, e);
    }
};

exports.updateGamePlayers = async(gameId, user, data) => {
    const game = await this.findOne({ _id: gameId });
    if (!game) {
        throw generateError("GAME_NOT_FOUND", `Game not found with ID "${gameId}".`);
    }
    if (game.status !== "preparing") {
        throw generateError("CANT_UPDATE_PLAYERS", `Game with ID "${gameId}" doesn't have the "preparing" status, players can't be updated.`);
    }
    game.checkBelongsToUserFromReq({ user });
    for (const player of data.players) {
        const gamePlayer = game.getPlayerById(player._id);
        if (!gamePlayer) {
            throw generateError("PLAYER_NOT_FOUND", `Player with ID ${player._id} not found for game with ID "${gameId}".`);
        } else if (player.team && !game.teams.find(({ name }) => name === player.team)) {
            throw generateError("UNKNOWN_TEAM", `Team "${player.team}" is unknown for game with ID "${gameId}".`);
        }
        gamePlayer.set({ ...gamePlayer, ...player });
    }
    game.checkTeamsSize();
    return game.save();
};

exports.patchGamePlayers = async(req, res) => {
    try {
        const { params, body } = checkRequestData(req);
        const game = await this.updateGamePlayers(params.id, req.user, body);
        return res.status(200).json(game);
    } catch (e) {
        sendError(res, e);
    }
};