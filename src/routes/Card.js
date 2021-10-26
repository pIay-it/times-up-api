const Card = require("../controllers/Card");
const { basicLimiter } = require("../helpers/constants/Route");

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
};