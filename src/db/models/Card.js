const mongoose = require("mongoose");
const CardSchema = require("../schemas/Card");
const CardModel = mongoose.model("cards", CardSchema);
module.exports = CardModel;