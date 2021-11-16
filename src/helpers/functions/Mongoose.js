const mongoose = require("mongoose");
const Config = require("../../../config");

exports.connect = () => {
    const mongooseOptions = { useUnifiedTopology: true };
    if (Config.db.auth.user && Config.db.auth.pass) {
        mongooseOptions.auth = { authSource: "admin" };
        mongooseOptions.username = Config.db.auth.user;
        mongooseOptions.password = Config.db.auth.pass;
        console.log(mongooseOptions);
    }
    const URI = `mongodb://localhost/${Config.db.name}`;
    return mongoose.connect(URI, mongooseOptions);
};