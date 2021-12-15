const { query } = require("express-validator");
const Image = require("../controllers/Image");
const { defaultLimiter } = require("../helpers/constants/Route");
const { basicAndJWTAuth } = require("../helpers/functions/Passport");

module.exports = app => {
    /**
     * @api {GET} /images A] Get images
     * @apiName GetImages
     * @apiGroup Images 🖼️
     * @apiDescription For a specified search, retrieve images from multiple APIs. Wikipedia and Flickr are available.
     *
     * @apiParam (Query String Parameters) {String} search Search term for retrieving images.
     * @apiSuccess {String} title Image's title or label.
     * @apiSuccess {String} URL Image's URL.
     * @apiSuccess {String={"wikipedia", "flickr"}} source Image's source between the implemented APIs.
     */
    app.get("/images", basicAndJWTAuth, defaultLimiter, [
        query("search")
            .isString().withMessage("Must be a valid string.")
            .trim()
            .notEmpty().withMessage("Can't be empty"),
    ], Image.getImages);
};