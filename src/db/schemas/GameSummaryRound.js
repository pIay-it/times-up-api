const { Schema } = require("mongoose");
const PlayerSchema = require("./Player");
const GameSummaryRoundScoreSchema = require("./GameSummaryRoundScoreSchema");

const GameRoundSummarySchema = new Schema({
    number: {
        type: Number,
        required: true,
        min: 1,
        max: 4,
    },
    team: { type: String },
    player: { type: PlayerSchema },
    scores: {
        type: [GameSummaryRoundScoreSchema],
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = GameRoundSummarySchema;