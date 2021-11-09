const { query, param, body } = require("express-validator");
const Game = require("../controllers/Game");
const { getGameDefaultOptions, getGameStatuses } = require("../helpers/functions/Game");
const { defaultLimiter, gameCreationLimiter } = require("../helpers/constants/Route");
const { basicAuth } = require("../helpers/functions/Passport");
const { filterOutHTMLTags, removeMultipleSpacesToSingle } = require("../helpers/functions/String");
const { getCardCategories } = require("../helpers/functions/Card");
const gameDefaultOptions = getGameDefaultOptions();
const gameStatuses = getGameStatuses();
const cardCategories = getCardCategories();

module.exports = app => {
    /**
     * @apiDefine GameResponse
     * @apiSuccess {ObjectID} _id Game's ID.
     * @apiSuccess {Player[]} players Game's players. (_See: [Classes - Player](#player-structure)_)
     * @apiSuccess {Card[]} cards Game's cards. (_See: [Classes - Card](#card-structure)_)
     * @apiSuccess {String} status Game's status. (_Possibilities: [Codes - Game Statuses](#game-statuses)_)
     * @apiSuccess {Number} round Game's current round. Final round can be either `3` or `4` depending on game's options.
     * @apiSuccess {Number} turn Game's current turn for the current round. Set back to `1` when changing round.
     * @apiSuccess {Player} speaker Game's speaker for the current turn. The speaker is the one trying to make his team or partner guesses cards. (_See: [Classes - Player](#player-structure)_)
     * @apiSuccess {Player} [guesser] Game's guesser for the current turn, set only if `options.players.areTeamUp` is `false`. The guesser is the one trying to guess the card. (_See: [Classes - Player](#player-structure)_)
     * @apiSuccess {GameHistory[]} [history] Game's history to keep track of all plays. (_See: [Classes - Game History](#game-history-structure)_)
     * @apiSuccess {GameSummary} [summary] Game's summary with scores of every teams for each round and winners. (_See: [Structures - Game Summary](#game-summary-structure)_)
     * @apiSuccess {GameOptions} options Game's options to personalize the party. (_See: [Classes - Game Options](#game-options-structure)_)
     * @apiSuccess {Date} createdAt When the game was created.
     * @apiSuccess {Date} updatedAt When the game was updated.
     */

    /**
     * @api {GET} /games A] Get games
     * @apiName GetGames
     * @apiGroup Games 🎲
     * @apiPermission Basic
     *
     * @apiParam (Query String Parameters) {String} [fields] Specifies which fields to include. Each value must be separated by a `,` without space. (e.g: `label,createdAt`)
     * @apiParam (Query String Parameters) {Number{>= 1}} [limit] Limit the number of games returned.
     * @apiUse GameResponse
     */
    app.get("/games", basicAuth, defaultLimiter, [
        query("fields")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .custom(value => (/^[A-z]+(?:,[A-z]+)*$/u).test(value) ? Promise.resolve() : Promise.reject(new Error()))
            .withMessage("Each value must be separated by a `,` without space. (e.g: `label,createdAt`)"),
        query("limit")
            .optional()
            .isInt({ min: 1 }).withMessage("Must be a valid number greater than 0.")
            .toInt(),
    ], Game.getGames);

    /**
     * @api {GET} /games/:id B] Get a game
     * @apiName GetGame
     * @apiGroup Games 🎲
     *
     * @apiParam (Route Parameters) {ObjectId} id Game's ID.
     * @apiUse GameResponse
     */
    app.get("/games/:id", defaultLimiter, [
        param("id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
    ], Game.getGame);

    /**
     * @api {POST} /games C] Create a game
     * @apiName CreateGame
     * @apiGroup Games 🎲
     *
     * @apiParam (Request Body Parameters) {Object[]} players Game's players. Must contain between 4 and 20 players.
     * @apiParam (Request Body Parameters) {String{>= 1 && <= 30}} players.name Player's name. Must be unique in the array and between 1 and 30 characters long.
     * @apiParam (Request Body Parameters) {String{"preparing" or "playing"}} [status=preparing] Game's first status. (_See: [Codes - Game Statuses](#game-statuses)_)
     * @apiParam (Request Body Parameters) {Object} [options] Game's options to personalize the party.
     * @apiParam (Request Body Parameters) {Object} [options.players] Game's options related to players.
     * @apiParam (Request Body Parameters) {Boolean} [options.players.areTeamUp=true]  If set to `true`, teams are made among players. Else, players must win by themselves. Default is `true` based on official rules.
     * @apiParam (Request Body Parameters) {Object} [options.cards] Game's options related to cards.
     * @apiParam (Request Body Parameters) {Number{>= 5 && <= 100}} [options.cards.count=40] Number of cards to guess during each rounds. Default is `40` based on official rules.
     * @apiParam (Request Body Parameters) {String[]} [options.cards.categories] Cards categories to include for cards to guess. Default are all categories. (_Possibilities: [Codes - Card Categories](#card-categories)_)
     * @apiParam (Request Body Parameters) {Number[]{>= 1 && <= 3}} [options.cards.difficulties=[1,2,3]] Cards difficulties to include for cards to guess. Default are all difficulties. Each value must be between 1 and 3.
     * @apiParam (Request Body Parameters) {Object} [options.cards.helpers] Game's options related to cards helpers that help players to guess cards.
     * @apiParam (Request Body Parameters) {Boolean} [options.cards.helpers.areDisplayed=true] If set to `true`, description and/or image can be displayed to guess the card more easily. Default is `true`.
     * @apiParam (Request Body Parameters) {Object} [options.rounds] Game's options related to rounds.
     * @apiParam (Request Body Parameters) {Number{3 || 4}} [options.rounds.count=3] Number of rounds for this game. Default is `3` based on official rules.
     * @apiParam (Request Body Parameters) {Object} [options.rounds.turns] Game's options related to rounds turns.
     * @apiParam (Request Body Parameters) {Number{>= 10 && <= 180}} [options.rounds.turns.timeLimit=30] Time in seconds allowed for a player's turn. Default is `30` seconds based on official rules.
     * @apiUse GameResponse
     */
    app.post("/games", gameCreationLimiter, [
        body("players")
            .isArray().withMessage("Must be a valid array.")
            .custom(value => value.length >= 4 && value.length <= 20 ? Promise.resolve() : Promise.reject(new Error()))
            .withMessage("Must contain between 4 and 20 players"),
        body("players.*.name")
            .isString().withMessage("Must be a valid string.")
            .customSanitizer(name => filterOutHTMLTags(name))
            .trim()
            .customSanitizer(name => removeMultipleSpacesToSingle(name))
            .isLength({ min: 1, max: 30 }).withMessage("Must be between 1 and 30 characters long"),
        body("status")
            .default("preparing")
            .isString().withMessage("Must be a valid string.")
            .isIn(["preparing", "playing"]).withMessage("Must be equal to either 'preparing' or 'playing'."),
        body("options.players.areTeamUp")
            .default(gameDefaultOptions.players.areTeamUp)
            .isBoolean().withMessage("Must be a valid boolean.")
            .toBoolean(),
        body("options.cards.count")
            .default(gameDefaultOptions.cards.count)
            .isInt({ min: 5, max: 100 }).withMessage("Must be a valid number between 5 and 100.")
            .toInt(),
        body("options.cards.categories")
            .default(cardCategories)
            .isArray().withMessage("Must be a valid array.")
            .notEmpty().withMessage("Can't be empty."),
        body("options.cards.categories.*")
            .isString().withMessage("Must be a valid string.")
            .trim()
            .isIn(cardCategories).withMessage(`Must be one of the following values: ${cardCategories}.`),
        body("options.cards.difficulties")
            .default(gameDefaultOptions.cards.difficulties)
            .isArray().withMessage("Must be a valid array.")
            .notEmpty().withMessage("Can't be empty."),
        body("options.cards.difficulties.*")
            .isInt({ min: 1, max: 3 }).withMessage("Must be a valid number between 1 and 3.")
            .toInt(),
        body("options.cards.helpers.areDisplayed")
            .default(gameDefaultOptions.cards.helpers.areDisplayed)
            .isBoolean().withMessage("Must be a valid boolean.")
            .toBoolean(),
        body("options.rounds.count")
            .default(gameDefaultOptions.rounds.count)
            .isInt({ min: 3, max: 4 }).withMessage("Must be a valid number between 3 and 4.")
            .toInt(),
        body("options.rounds.turns.timeLimit")
            .default(gameDefaultOptions.rounds.turns.timeLimit)
            .isInt({ min: 10, max: 180 }).withMessage("Must be a valid number between 10 and 180.")
            .toInt(),
    ], Game.postGame);

    /**
     * @api {PATCH} /games/:id D] Update a game
     * @apiName UpdateGame
     * @apiGroup Games 🎲
     * @apiPermission Basic
     *
     * @apiParam (Route Parameters) {ObjectId} id Game's ID.
     * @apiParam (Request Body Parameters) {String} [status] Game's status. (_See: [Codes - Game Statuses](#game-statuses)_)
     * @apiUse GameResponse
     */
    app.patch("/games/:id", basicAuth, defaultLimiter, [
        param("id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
        body("status")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .isIn(gameStatuses).withMessage(`Must be one of the following values: ${gameStatuses}.`),
    ], Game.patchGame);

    /**
     * @api {DELETE} /games E] Delete a game
     * @apiName DeleteGame
     * @apiGroup Games 🎲
     * @apiPermission Basic
     *
     * @apiParam (Route Parameters) {ObjectId} id Game's ID.
     * @apiUse GameResponse
     */
    app.delete("/games/:id", basicAuth, defaultLimiter, [
        param("id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
    ], Game.deleteGame);

    /**
     * @api {POST} /games/:id/play F] Make a play
     * @apiName MakeGamePlay
     * @apiGroup Games 🎲
     *
     * @apiParam (Route Parameters) {ObjectId} id Game's ID.
     * @apiUse GameResponse
     */
    app.post("/games/:id/play", defaultLimiter, [
        param("id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
    ], Game.postPlay);
};