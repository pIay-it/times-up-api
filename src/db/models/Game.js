const mongoose = require("mongoose");
const GameSchema = require("../schemas/Game");
const GameModel = mongoose.model("games", GameSchema);
module.exports = GameModel;