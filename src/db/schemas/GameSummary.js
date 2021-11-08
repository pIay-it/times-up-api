const { Schema } = require("mongoose");
const PlayerSchema = require("./Player");
const GameRoundSummarySchema = require("./GameSummaryRound");
const GameSummaryScoreSchema = require("./GameSummaryScore");

const GameSummarySchema = new Schema({
    rounds: {
        type: [GameRoundSummarySchema],
        default: undefined,
    },
    scores: {
        type: [GameSummaryScoreSchema],
        default: undefined,
    },
    winners: {
        players: {
            type: [PlayerSchema],
            default: undefined,
        },
        team: { type: String },
    },
}, {
    id: false,
    timestamps: false,
    versionKey: false,
});

module.exports = GameSummarySchema;