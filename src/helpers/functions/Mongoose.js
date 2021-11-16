const mongoose = require("mongoose");
const Config = require("../../../config");

exports.connect = () => {
    const mongooseOptions = { useUnifiedTopology: true };
    if (Config.db.auth.user && Config.db.auth.pass) {
        mongooseOptions.auth = { authSource: "admin" };
        mongooseOptions.user = Config.db.auth.user;
        mongooseOptions.pass = encodeURIComponent(Config.db.auth.pass);
    }
    return mongoose.connect(`mongodb://localhost/${Config.db.name}`, mongooseOptions);
};