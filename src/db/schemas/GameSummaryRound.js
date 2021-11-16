const { Schema } = require("mongoose");
const GameSummaryScoreSchema = require("./GameSummaryScore");

const GameRoundSummarySchema = new Schema({
    number: {
        type: Number,
        required: true,
        min: 1,
        max: 4,
    },
    scores: {
        type: [GameSummaryScoreSchema],
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = GameRoundSummarySchema;