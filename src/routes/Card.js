const { param, body, query } = require("express-validator");
const Card = require("../controllers/Card");
const { defaultLimiter } = require("../helpers/constants/Route");
const { basicAuth } = require("../helpers/functions/Passport");
const { getCardCategories } = require("../helpers/functions/Card");
const { toTitleCase, filterOutHTMLTags, removeMultipleSpacesToSingle } = require("../helpers/functions/String");

module.exports = app => {
    /**
     * @apiDefine CardResponse
     * @apiSuccess {ObjectID} _id Card's ID.
     * @apiSuccess {String} [label] Card's label to be guessed.
     * @apiSuccess {String} [status] Card's status for the current game's round and turn. (_Possibilities: [Codes - Card Statuses](#card-statuses)_)
     * @apiSuccess {String[]} [categories] Card's categories. (_Possibilities: [Codes - Card Categories](#card-categories)_)
     * @apiSuccess {Number{>= 1 && <= 3}} [difficulty] Card's difficulty to guess. Set from 1 (easiest) to 3 (hardest).
     * @apiSuccess {Number{>= 1}} [playingTime] Time in seconds taken by the speaker to play this card.
     * @apiSuccess {String} [description] Card's description which can help to guess it.
     * @apiSuccess {String} [imageURL] Card's image URL which can help to guess it.
     * @apiSuccess {Date} createdAt When the card was created.
     * @apiSuccess {Date} updatedAt When the card was updated.
     */

    /**
     * @api {GET} /cards A] Get cards
     * @apiName GetCards
     * @apiGroup Cards 🃏️
     *
     * @apiParam (Query String Parameters) {String} [label] Filter by label. All cards containing the specified label (case insensitive) will be returned.
     * @apiParam (Query String Parameters) {String} [categories] Filter by categories. Multiple categories can be specified.<br/><br/> - Separate values with `,` for filtering cards containing all those categories. (AND operator)<br/> - Separate values with `|` for filtering cards containing any of those categories. (OR operator)<br/><br/>You can't mix `,` and `|`, don't insert space.<hr/>Example: `video-game,art` for cards having `video-game` AND `art` categories or `nature|animal` for cards having `nature` OR `animal` categories.
     * @apiParam (Query String Parameters) {Number{>= 1 && <= 3}} [difficulty] Filter by difficulty.
     * @apiParam (Query String Parameters) {String} [fields] Specifies which fields to include. Each value must be separated by a `,` without space. (e.g: `label,createdAt`)
     * @apiParam (Query String Parameters) {Number{>= 1}} [limit] Limit the number of cards returned.
     * @apiUse CardResponse
     */
    app.get("/cards", defaultLimiter, [
        query("label")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .trim()
            .notEmpty().withMessage("Can't be empty.")
            .customSanitizer(label => ({ $regex: label, $options: "ui" })),
        query("categories")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .custom(value => (/^[a-z-]+(?:,[a-z-]+)*$|^[a-z-]+(?:\|[a-z-]+)*$/u).test(value) ? Promise.resolve() : Promise.reject(new Error()))
            .withMessage("Each value must be separated by a `,` or `|` without space. (e.g: `field1,field2` or `field1|field2`)")
            .customSanitizer(categories => {
                if ((/^[a-z-]+(?:,[a-z-]+)*$/u).test(categories)) {
                    return { $all: categories.split(",") };
                }
                return { $in: categories.split("|") };
            }),
        query("difficulty")
            .optional()
            .isInt({ min: 1, max: 3 }).withMessage("Must be a valid number between 1 and 3.")
            .toInt(),
        query("fields")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .custom(value => (/^[A-z]+(?:,[A-z]+)*$/u).test(value) ? Promise.resolve() : Promise.reject(new Error()))
            .withMessage("Each value must be separated by a `,` without space. (e.g: `label,createdAt`)"),
        query("limit")
            .optional()
            .isInt({ min: 1 }).withMessage("Must be a valid number greater than 0.")
            .toInt(),
    ], Card.getCards);

    /**
     * @api {GET} /cards/:id B] Get a card
     * @apiName GetCard
     * @apiGroup Cards 🃏️
     *
     * @apiParam (Route Parameters) {ObjectId} id Card's ID.
     * @apiUse CardResponse
     */
    app.get("/cards/:id", defaultLimiter, [
        param("id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
    ], Card.getCard);

    /**
     * @api {POST} /cards C] Create a card
     * @apiName CreateCard
     * @apiGroup Cards 🃏️
     * @apiPermission Basic
     *
     * @apiParam (Request Body Parameters) {String} label Card's label to guess.<br/><br/>This value will be Title Cased (all words will be capitalized only on first letter).
     * @apiParam (Request Body Parameters) {String[]} categories Card's categories, can't be empty. (_Possibilities: [Codes - Card Categories](#card-categories))<br/><br/>⚠️ WARNING: Adding some `sub-categories` will automatically add their main category. (e.g : `nature` will be automatically added if there is `animal` in the array)
     * @apiParam (Request Body Parameters) {Number{>= 1 && <= 3}} difficulty Card's difficulty to guess. Set from 1 (easiest) to 3 (hardest).
     * @apiParam (Request Body Parameters) {String} [description] Card's description which can help to guess it.
     * @apiParam (Request Body Parameters) {String} [imageURL] Card's image URL which can help to guess it. Must be HTTPS.
     * @apiUse CardResponse
     */
    app.post("/cards", basicAuth, defaultLimiter, [
        body("label")
            .isString().withMessage("Must be a valid string.")
            .customSanitizer(label => filterOutHTMLTags(label))
            .trim()
            .customSanitizer(label => removeMultipleSpacesToSingle(label))
            .customSanitizer(label => toTitleCase(label))
            .notEmpty().withMessage("Can't be empty."),
        body("categories")
            .isArray().withMessage("Must be a valid array.")
            .notEmpty().withMessage("Can't be empty."),
        body("categories.*")
            .isString().withMessage("Must be a valid string.")
            .trim()
            .isIn(getCardCategories()).withMessage(`Must be one of the following values: ${getCardCategories()}.`),
        body("difficulty")
            .isInt({ min: 1, max: 3 }).withMessage("Must be a valid number between 1 and 3.")
            .toInt(),
        body("description")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .customSanitizer(label => filterOutHTMLTags(label))
            .trim()
            .customSanitizer(label => removeMultipleSpacesToSingle(label))
            .default(undefined),
        body("imageURL")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .trim()
            .default(undefined)
            .isURL({ protocols: ["http", "https"] }).withMessage("Must be a valid HTTP(S) URL."),
    ], Card.postCard);

    /**
     * @api {PATCH} /cards/:id D] Update a card
     * @apiName UpdateCard
     * @apiGroup Cards 🃏️
     * @apiPermission Basic
     *
     * @apiParam (Route Parameters) {ObjectId} id Card's ID.
     * @apiParam (Request Body Parameters) {String} [label] Card's label to guess.<br/><br/>This value will be Title Cased (all words will be capitalized only on first letter).
     * @apiParam (Request Body Parameters) {String[]} [categories] Card's categories, can't be empty. (_Possibilities: [Codes - Card Categories](#card-categories))<br/><br/>⚠️ WARNING: Adding some `sub-categories` will automatically add their main category. (e.g : `nature` will be automatically added if there is `animal` in the array)
     * @apiParam (Request Body Parameters) {Number{>= 1 && <= 3}} [difficulty] Card's difficulty to guess. Set from 1 (easiest) to 3 (hardest).
     * @apiParam (Request Body Parameters) {String} [description] Card's description which can help to guess it.
     * @apiParam (Request Body Parameters) {String} [imageURL] Card's image URL which can help to guess it. Must be HTTPS.
     * @apiUse CardResponse
     */
    app.patch("/cards/:id", basicAuth, defaultLimiter, [
        param("id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
        body("label")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .customSanitizer(label => filterOutHTMLTags(label))
            .trim()
            .customSanitizer(label => removeMultipleSpacesToSingle(label))
            .customSanitizer(label => toTitleCase(label))
            .notEmpty().withMessage("Can't be empty."),
        body("categories")
            .optional()
            .isArray().withMessage("Must be a valid array.")
            .notEmpty().withMessage("Can't be empty."),
        body("categories.*")
            .isString().withMessage("Must be a valid string.")
            .trim()
            .isIn(getCardCategories()).withMessage(`Must be one of the following values: ${getCardCategories()}.`),
        body("difficulty")
            .optional()
            .isInt({ min: 1, max: 3 }).withMessage("Must be a valid number between 1 and 3.")
            .toInt(),
        body("description")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .customSanitizer(label => filterOutHTMLTags(label))
            .trim()
            .customSanitizer(label => removeMultipleSpacesToSingle(label)),
        body("imageURL")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .trim()
            .if(imageURL => !!imageURL)
            .isURL({ protocols: ["http", "https"] }).withMessage("Must be a valid HTTP(S) URL."),
    ], Card.patchCard);

    /**
     * @api {DELETE} /cards/:id E] Delete a card
     * @apiName DeleteCard
     * @apiGroup Cards 🃏️
     * @apiPermission Basic
     *
     * @apiParam (Route Parameters) {ObjectId} id Card's ID.
     * @apiUse CardResponse
     */
    app.delete("/cards/:id", basicAuth, defaultLimiter, [
        param("id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
    ], Card.deleteCard);
};