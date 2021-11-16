const mongoose = require("mongoose");
const Config = require("../../../config");

exports.connect = () => {
    const mongooseOptions = { useUnifiedTopology: true };
    let URI = `mongodb://`;
    if (Config.db.auth.user && Config.db.auth.pass) {
        mongooseOptions.auth = { authSource: "admin" };
        URI += `${Config.db.auth.user}:${Config.db.auth.pass}@`;
    }
    URI += `localhost/${Config.db.name}`;
    return mongoose.connect(URI, mongooseOptions);
};