const User = require("../controllers/User");
const { anonymousRegistrationLimiter } = require("../helpers/constants/Route");

module.exports = app => {
    /**
     * @api {POST} /anonymous-users A] Register anonymously
     * @apiName CreateAnonymousUser
     * @apiGroup Users 👤
     * @apiDescription This route allows users to be registered anonymously and so, can create, update or play with games with the `token` provided in response. This route can be called only once an hour.
     *
     * @apiSuccess {String} token JSON Web Token to provide for further route authentication.
     */
    app.post("/anonymous-users", anonymousRegistrationLimiter, User.registerAnonymously);
};