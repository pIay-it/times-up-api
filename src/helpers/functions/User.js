const { getAuthStrategyFromReq } = require("./Passport");
const { generateError } = require("./Error");

exports.checkJWTUserRights = (req, userId) => {
    if (getAuthStrategyFromReq(req) === "JWT" && userId.toString() !== req.user._id.toString()) {
        throw generateError("UNAUTHORIZED", "You can't access other's data.");
    }
};