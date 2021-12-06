const rateLimit = require("express-rate-limit");
const Config = require("../../../config");
const { generateError } = require("../functions/Error");

function rateLimitHandler(req, res, message) {
    res.status(429).json(generateError("TOO_MANY_REQUESTS", message));
}

exports.defaultLimiter = rateLimit({
    windowMs: 1000,
    max: Config.app.nodeEnv !== "test" ? 3 : 0,
    handler: (req, res) => rateLimitHandler(req, res, "Too many requests. Please try later."),
});

exports.gameCreationLimiter = rateLimit({
    windowMs: 5000,
    max: Config.app.nodeEnv !== "test" ? 1 : 0,
    handler: (req, res) => rateLimitHandler(req, res, "Too many requests for creating a game. Please try later."),
});

exports.anonymousRegistrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: Config.app.nodeEnv !== "test" ? 1 : 0,
    handler: (req, res) => rateLimitHandler(req, res, "Too many requests for anonymous registration. Please try later."),
});