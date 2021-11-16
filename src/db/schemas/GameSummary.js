const { Schema } = require("mongoose");
const PlayerSchema = require("./Player");
const GameSummaryRoundSchema = require("./GameSummaryRound");
const GameSummaryScoreSchema = require("./GameSummaryScore");

const GameSummarySchema = new Schema({
    rounds: {
        type: [GameSummaryRoundSchema],
        default: undefined,
    },
    finalScores: {
        type: [GameSummaryScoreSchema],
        default: undefined,
    },
    winners: {
        players: {
            type: [PlayerSchema],
            default: undefined,
        },
        teams: {
            type: [String],
            default: undefined,
        },
    },
}, {
    id: false,
    timestamps: false,
    versionKey: false,
});

module.exports = GameSummarySchema;