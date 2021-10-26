const { param, body } = require("express-validator");
const Card = require("../controllers/Card");
const { basicLimiter } = require("../helpers/constants/Route");
const { getCardCategories } = require("../helpers/functions/Card");
const { toTitleCase, filterOutHTMLTags } = require("../helpers/functions/String");

module.exports = app => {
    /**
     * @apiDefine CardResponse
     * @apiSuccess {ObjectID} _id Card's ID.
     * @apiSuccess {String} label Card's label to be guessed.
     * @apiSuccess {String[]} categories Card's categories. (_Possibilities: [Codes - Card Categories](#card-categories))
     * @apiSuccess {Number{>= 1 && <= 3}} difficulty Card's difficulty to guess. Set from 1 (easiest) to 3 (hardest).
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
     * @apiUse CardResponse
     */
    app.get("/cards", basicLimiter, Card.getCards);

    /**
     * @api {GET} /cards/:id B] Get a card
     * @apiName GetCard
     * @apiGroup Cards 🃏️
     *
     * @apiParam (Route Parameters) {ObjectId} id Card's ID.
     * @apiUse CardResponse
     */
    app.get("/cards/:id", basicLimiter, [
        param("id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
    ], Card.getCard);

    /**
     * @api {POST} /cards C] Create a card
     * @apiName CreateCard
     * @apiGroup Cards 🃏️
     *
     * @apiParam (Request Body Parameters) {String} label Card's label to guess.<br/><br/>This value will be Title Cased (all words will be capitalized only on first letter).
     * @apiParam (Request Body Parameters) {String[]} categories Card's categories, can't be empty. (_Possibilities: [Codes - Card Categories](#card-categories))<br/><br/>⚠️ WARNING: Adding some `sub-categories` will automatically add their main category. (e.g : `nature` will be automatically added if there is `animal` in the array)
     * @apiParam (Request Body Parameters) {Number{>= 1 && <= 3}} difficulty Card's difficulty to guess. Set from 1 (easiest) to 3 (hardest).
     * @apiParam (Request Body Parameters) {String} [description] Card's description which can help to guess it.
     * @apiParam (Request Body Parameters) {String} [imageURL] Card's image URL which can help to guess it. Must be HTTPS.
     * @apiUse CardResponse
     */
    app.post("/cards", basicLimiter, [
        body("label")
            .isString().withMessage("Must be a valid string.")
            .customSanitizer(label => filterOutHTMLTags(label))
            .trim()
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
            .notEmpty().withMessage("Can't be empty."),
        body("imageURL")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .trim()
            .isURL({ protocols: ["https"] }).withMessage("Must be a valid HTTPS URL."),
    ], Card.postCard);

    /**
     * @api {PATCH} /cards/:id D] Update a card
     * @apiName UpdateCard
     * @apiGroup Cards 🃏️
     *
     * @apiParam (Route Parameters) {ObjectId} id Card's ID.
     * @apiParam (Request Body Parameters) {String} [label] Card's label to guess.<br/><br/>This value will be Title Cased (all words will be capitalized only on first letter).
     * @apiParam (Request Body Parameters) {String[]} [categories] Card's categories, can't be empty. (_Possibilities: [Codes - Card Categories](#card-categories))<br/><br/>⚠️ WARNING: Adding some `sub-categories` will automatically add their main category. (e.g : `nature` will be automatically added if there is `animal` in the array)
     * @apiParam (Request Body Parameters) {Number{>= 1 && <= 3}} [difficulty] Card's difficulty to guess. Set from 1 (easiest) to 3 (hardest).
     * @apiParam (Request Body Parameters) {String} [description] Card's description which can help to guess it.
     * @apiParam (Request Body Parameters) {String} [imageURL] Card's image URL which can help to guess it. Must be HTTPS.
     * @apiUse CardResponse
     */
    app.patch("/cards/:id", basicLimiter, [
        param("id")
            .isMongoId().withMessage("Must be a valid ObjectId."),
        body("label")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .customSanitizer(label => filterOutHTMLTags(label))
            .trim()
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
            .notEmpty().withMessage("Can't be empty."),
        body("imageURL")
            .optional()
            .isString().withMessage("Must be a valid string.")
            .trim()
            .isURL({ protocols: ["https"] }).withMessage("Must be a valid HTTPS URL."),
    ], Card.patchCard);
};