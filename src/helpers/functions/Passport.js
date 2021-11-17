const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const { sendError, generateError } = require("./Error");
const Config = require("../../../config");

passport.use(new BasicStrategy((username, password, done) => {
    if (username === Config.app.basicAuth.username && password === Config.app.basicAuth.password) {
        return done(null, { strategy: "basic" });
    }
    return done(null, false);
}));

exports.basicAuth = (req, res, next) => passport.authenticate("basic", { session: false }, (err, user) => {
    if (err) {
        return next(err);
    } else if (!user) {
        return sendError(res, generateError("UNAUTHORIZED", "Bad credentials for basic authentication."));
    }
    req.user = user;
    next();
})(req, res, next);