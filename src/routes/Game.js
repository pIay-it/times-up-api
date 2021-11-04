const { query, param, body } = require("express-validator");
const Game = require("../controllers/Game");
const { defaultLimiter, gameCreationLimiter } = require("../helpers/constants/Route");
const { basicAuth } = require("../helpers/functions/Passport");
const { filterOutHTMLTags, removeMultipleSpacesToSingle } = require("../helpers/functions/String");

module.exports = app => {
    /**
     * @apiDefine GameResponse
     * @apiSuccess {ObjectID} _id Game's ID.
     * @apiSuccess {Player[]} players Game's players. (_See: [Classes - Player](#player-class)_)
     * @apiSuccess {Card[]} cards Game's cards. (_See: [Classes - Card](#card-class)_)
     * @apiSuccess {String} status Game's status. (_Possibilities: [Codes - Game Statuses](#game-statuses)_)
     * @apiSuccess {Number} round Game's current round. Final round can be either `3` or `4` depending on game's options.
     * @apiSuccess {Number} turn Game's current turn for the current round. Set back to `1` when changing round.
     * @apiSuccess {Player} speaker Game's speaker for the current turn. The speaker is the one trying to make his team or partner guesses cards. (_See: [Classes - Player](#player-class)_)
     * @apiSuccess {Player} [guesser] Game's guesser for the current turn, set only if `options.players.areTeamUp` is `false`. The guesser is the one trying to guess the card. (_See: [Classes - Player](#player-class)_)
     * @apiSuccess {Object} options Game's options to personalize the party.
     * @apiSuccess {Object} options.players Game's options related to players.
     * @apiSuccess {Boolean} options.players.areTeamUp=true If set to `true`, teams are made among players. Else, players must win by themselves. Default is `true` based on official rules.
     * @apiSuccess {Object} options.cards Game's options related to cards.
     * @apiSuccess {Number} options.cards.count=40 Number of cards to guess during each rounds. Default is `40` based on official rules.
     * @apiSuccess {String[]} options.cards.categories Cards categories to include for cards to guess. Default are all categories. (_Possibilities: [Codes - Card Categories](#card-categories)_)
     * @apiSuccess {Number[]} options.cards.difficulties=[1, 2, 3] Cards difficulties to include for cards to guess. Default are all difficulties. `[1, 2, 3]`
     * @apiSuccess {Object} options.cards.helpers Game's options related to cards helpers that help players to guess cards.
     * @apiSuccess {Boolean} options.cards.helpers.areDisplayed=true If set to `true`, description and/or image can be displayed to guess the card more easily. Default is `true`.
     * @apiSuccess {Object} options.rounds Game's options related to rounds.
     * @apiSuccess {Number} options.rounds.count=3 Number of rounds for this game. Default is `3` based on official rules.
     * @apiSuccess {Object} options.rounds.turns Game's options related to rounds turns.
     * @apiSuccess {Number} options.rounds.turns.timeLimit=30 Time in seconds allowed for a player's turn. Default is `30` seconds based on official rules.
     * @apiSuccess {GameHistory[]} [history] Game's history to keep track of all plays. (_See: [Classes - Game History](#game-history-class)_)
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
     * @apiUse GameResponse
     */
    app.post("/games", gameCreationLimiter, [
        body("players")
            .isArray().withMessage("Must be a valid array")
            .custom(value => value.length >= 4 && value.length <= 20 ? Promise.resolve() : Promise.reject(new Error()))
            .withMessage("Must contain between 4 and 20 players"),
        body("players.*.name")
            .isString().withMessage("Must be a valid string")
            .customSanitizer(name => filterOutHTMLTags(name))
            .trim()
            .customSanitizer(name => removeMultipleSpacesToSingle(name))
            .isLength({ min: 1, max: 30 }).withMessage("Must be between 1 and 30 characters long"),
    ], Game.postGame);
};