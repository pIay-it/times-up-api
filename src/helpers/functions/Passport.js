const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const { Strategy: JWTStrategy, ExtractJwt: ExtractJWT } = require("passport-jwt");
const { sendError, generateError } = require("./Error");
const Config = require("../../../config");
const authOptions = { session: false };

passport.use(new BasicStrategy((username, password, done) => {
    const { basic: basicAuth } = Config.app.routes.auth;
    if (username === basicAuth.username && password === basicAuth.password) {
        return done(null, { strategy: "basic" });
    }
    return done(null, false);
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: Config.app.routes.auth.JWT.privateKey,
}, ({ userId, mode }, cb) => {
    if (mode === "anonymous") {
        return cb(null, { _id: userId, mode, strategy: "JWT" });
    }
    return cb(null);
}));

function passportAuthCallback(err, user, req, res, next) {
    if (err) {
        return next(err);
    } else if (!user) {
        return sendError(res, generateError("UNAUTHORIZED", "Please provide correct authentication."));
    }
    req.user = user;
    next();
}

function passportAuth(methods, req, res, next) {
    return passport.authenticate(methods, authOptions, (err, user) => passportAuthCallback(err, user, req, res, next));
}

exports.basicAuth = (req, res, next) => passportAuth(["basic"], req, res, next)(req, res, next);

exports.JWTAuth = (req, res, next) => passportAuth(["jwt"], req, res, next)(req, res, next);

exports.basicAndJWTAuth = (req, res, next) => passportAuth(["jwt", "basic"], req, res, next)(req, res, next);

exports.getAuthStrategyFromReq = req => req?.user?.strategy;