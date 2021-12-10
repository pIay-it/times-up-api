const { query, param, body } = require("express-validator");
const Game = require("../controllers/Game");
const { getGameDefaultOptions, getGameStatuses, getGameSortByFields } = require("../helpers/functions/Game");
const { defaultLimiter, gameCreationLimiter } = require("../helpers/constants/Route");
const { basicAuth, basicAndJWTAuth, getAuthStrategyFromReq } = require("../helpers/functions/Passport");
const { getQueryStringOrderValues, getMongooseOrderValueFromQueryString } = require("../helpers/functions/Express");
const { filterOutHTMLTags, removeMultipleSpacesToSingle } = require("../helpers/functions/String");
const { getCardCategories, getCardPlayableStatuses } = require("../helpers/functions/Card");
const gameDefaultOptions = getGameDefaultOptions();
const gameStatuses = getGameStatuses();
const gameSortByFields = getGameSortByFields();
const queryStringOrderValues = getQueryStringOrderValues();
const cardCategories = getCardCategories();
const cardPlayableStatuses = getCardPlayableStatuses();

module.exports = app => {
    /**
     * @apiDefine GameResponse
     * @apiSuccess {ObjectID} _id Game's ID.
     * @apiSuccess {Player[]} players Game's players. (_See: [Classes - Player](#player-structure)_)
     * @apiSuccess {Card[]} cards Game's cards. (_See: [Classes - Card](#card-structure)_)
     * @apiSuccess {Object} [anonymousUser] Game's anonymous creator data. Set only if game was created by an anonymous user.
     * @apiSuccess {String} anonymousUser._id Game's anonymous creator ID. Prefixed by `anonymous-`.
     * @apiSuccess {String} status Game's status. (_Possibilities: [Codes - Game Statuses](#game-statuses)_)
     * @apiSuccess {Number} round Game's current round. Final round can be either `3` or `4` depending on game's options.
     * @apiSuccess {Number} turn Game's current turn for the current round. Set back to `1` when changing round.
     * @apiSuccess {Player} speaker Game's speaker for the current turn. The speaker is the one trying to make his team or partner guesses cards. (_See: [Classes - Player](#player-structure)_)
     * @apiSuccess {Player} [guesser] Game's guesser for the current turn, set only if `options.players.areTeamUp` is `false`. The guesser is the one trying to guess the card. (_See: [Classes - Player](#player-structure)_)
     * @apiSuccess {GameHistory[]} [history] Game's history to keep track of all plays. (_See: [Classes - Game History](#game-history-structure)_)
     * @apiSuccess {GameSummary} [summary] Game's summary with scores of every team for each round and winners. (_See: [Structures - Game Summary](#game-summary-structure)_)
     * @apiSuccess {GameOptions} options Game's options to personalize the party. (_See: [Classes - Game Options](#game-options-structure)_)
     * @apiSuccess {Date} createdAt When the game was created.
     * @apiSuccess {Date} updatedAt When the game was updated.
     */

    /**
     * @api {GET} /games A] Get games
     * @apiName GetGames
     * @apiGroup Games 🎲
     * @apiPermission JWT
     * @apiPermission Basic
     * @apiDescription Get games filtered by query string parameters if specified.
     * - `JWT auth`: Only games created by the user attached to token can be retrieved from this route. Works for both `anonymous` and `registered` users.
     * - `Basic auth`: All games can be retrieved.
     *
     * @apiParam (Query String Parameters) {String} [anonymous-user-id] Filter by anonymous' user ID.<hr/>⚠️ Only available for `Basic` auth.
     * @apiParam (Query String Parameters) {String} [status] Filter by status. Multiple statuses can be specified. Each value must be separated by a `,` without space. (e.g: `preparing,playing`)
     * @apiParam (Query String Parameters) {String} [fields] Specifies which fields to include. Each value must be separated by a `,` without space. (e.g: `_id,createdAt`)
     * @apiParam (Query String Parameters) {Number{>= 1}} [limit] Limit the number of games returned.
     * @apiParam (Query String Parameters) {String} [order-by="createdAt"] Specifies which field will sort the results. Possibilities are `createdAt` or `updatedAt`.
     * @apiParam (Query String Parameters) {String} [sort="asc"] Specifies to sort results in `ascending` or `descending` way. Possibilities are `ascending` (`asc`) or `descending` (`desc`).
     * @apiUse GameResponse
     */
    app.get("/games", basicAndJWTAuth, defaultLimiter, [
        query("anonymous-user-id")
            .optional()
            .custom((value, { req }) => getAuthStrategyFromReq(req) === "basic" ? Promise.resolve() : Promise.reject(new Error()))
            .withMessage(`You can't use "anonymous-user-id" query string parameter with JWT auth. Use Basic auth instead.`)
            .isString().withMessage("Must be a valid string.")
            .notEmpty().withMessage("Can't be empty."),
        query("status")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .custom(value => (/^[a-z-]+(?:,[a-z-]+)*$/u).test(value) ? Promise.resolve() : Promise.reject(new Error()))
            .withMessage("Each value must be separated by a `,` without space. (e.g: `preparing,playing`)")
            .customSanitizer(statuses => ({ $in: statuses.split(",") })),
        query("fields")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .custom(value => (/^[A-z]+(?:,[A-z]+)*$/u).test(value) ? Promise.resolve() : Promise.reject(new Error()))
            .withMessage("Each value must be separated by a `,` without space. (e.g: `_id,createdAt`)"),
        query("limit")
            .optional()
            .isInt({ min: 1 }).withMessage("Must be a valid number greater than 0.")
            .toInt(),
        query("sort-by")
            .default("createdAt")
            .isString().withMessage("Must be a valid string.")
            .isIn(gameSortByFields).withMessage(`Must be one of the following values: ${gameSortByFields}.`),
        query("order")
            .default("asc")
            .isString().withMessage("Must be a valid string.")
            .isIn(queryStringOrderValues).withMessage(`Must be one of the following values: ${queryStringOrderValues}.`)
            .customSanitizer(order => getMongooseOrderValueFromQueryString(order)),
    ], Game.getGames);

    /**
     * @api {GET} /games/:id B] Get a game
     * @apiName GetGame
     * @apiGroup Games 🎲
     * @apiPermission JWT
     * @apiPermission Basic
     *
     * @apiParam (Route Parameters) {ObjectId} id Game's ID.
     * @apiUse GameResponse
     */
    app.get("/games/:id", basicAndJWTAuth, defaultLimiter, [
        param("id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
    ], Game.getGame);

    /**
     * @api {POST} /games C] Create a game
     * @apiName CreateGame
     * @apiGroup Games 🎲
     * @apiPermission JWT
     * @apiPermission Basic
     * @apiDescription Create a game. Behaviour is different among auths.
     * - `JWT auth from anonymous user`: Created game will have the `anonymousUser` set. This user can only have one game with status `preparing` or `playing` at a time.
     * - `Basic auth`: Created game won't have any user fields set. There is no limit for creation with this auth.
     *
     * @apiParam (Request Body Parameters) {Object[]} players Game's players. Must contain between 4 and 20 players.
     * @apiParam (Request Body Parameters) {String{>= 1 && <= 30}} players.name Player's name. Must be unique in the array and between 1 and 30 characters long.
     * @apiParam (Request Body Parameters) {String{"preparing" or "playing"}} [status=preparing] Game's first status. (_See: [Codes - Game Statuses](#game-statuses)_)
     * @apiParam (Request Body Parameters) {Object} [options] Game's options to personalize the party.
     * @apiParam (Request Body Parameters) {Object} [options.players] Game's options related to players.
     * @apiParam (Request Body Parameters) {Boolean} [options.players.areTeamUp=true]  If set to `true`, teams are made among players. Else, players must win by themselves. Default is `true` based on official rules.
     * @apiParam (Request Body Parameters) {Object} [options.cards] Game's options related to cards.
     * @apiParam (Request Body Parameters) {Number{>= 5 && <= 100}} [options.cards.count=40] Number of cards to guess during each round. Default is `40` based on official rules.
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
    app.post("/games", basicAndJWTAuth, gameCreationLimiter, [
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
     * @apiPermission JWT
     * @apiPermission Basic
     *
     * @apiParam (Route Parameters) {ObjectId} id Game's ID.
     * @apiParam (Request Body Parameters) {String} [status] Game's status. (_Possibilities: [Codes - Game Statuses](#game-statuses)_)<hr/>⚠️ JWT authenticated users can only update their `preparing` or `playing` games for the `playing` or `canceled` status.
     * @apiUse GameResponse
     */
    app.patch("/games/:id", basicAndJWTAuth, defaultLimiter, [
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
     * @apiDescription At the end of each turn, this route is called to save the play. In that way, it will be saved in database, score will be calculated and game can proceed to the next turn.
     * @apiPermission JWT
     * @apiPermission Basic
     *
     * @apiParam (Route Parameters) {ObjectId} id Game's ID.
     * @apiParam (Request Body Parameters) {Object[]} [cards] Cards which were guessed, discarded or skipped during the turn.
     * @apiParam (Request Body Parameters) {ObjectId} cards._id Card's ID.
     * @apiParam (Request Body Parameters) {String} cards.status Card's status during the turn. (_Possibilities: [Codes - Card Statuses](#card-statuses) **Except `to-guess`**_)
     * @apiParam (Request Body Parameters) {Number{> 0}} cards.playingTime Time in seconds taken by the speaker to play this card. Floats are allowed.
     * @apiUse GameResponse
     */
    app.post("/games/:id/play", basicAndJWTAuth, defaultLimiter, [
        param("id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
        body("cards")
            .optional()
            .isArray().withMessage("Must be a valid array.")
            .notEmpty().withMessage(`Can't be empty.`),
        body("cards.*._id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
        body("cards.*.status")
            .isString().withMessage("Must be a valid string.")
            .trim()
            .isIn(cardPlayableStatuses).withMessage(`Must be one of the following values: ${cardPlayableStatuses}`),
        body("cards.*.playingTime")
            .isFloat({ gt: 0 }).withMessage("Must be a valid number greater than 0. Floats are allowed.")
            .toFloat(),
    ], Game.postPlay);
};