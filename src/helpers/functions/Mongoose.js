const mongoose = require("mongoose");
const Config = require("../../../config");

exports.connect = () => {
    const mongooseOptions = { useUnifiedTopology: true };
    let suffix = "";
    let URI = "mongodb://";
    if (Config.db.auth.user && Config.db.auth.pass) {
        URI += `${Config.db.auth.user}:${encodeURIComponent(Config.db.auth.pass)}@`;
        suffix += "?authSource=admin";
    }
    URI += `${Config.db.host}:${Config.db.port}/${Config.db.name}${suffix}`;
    return mongoose.connect(URI, mongooseOptions);
};