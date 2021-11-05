const { Schema } = require("mongoose");
const PlayerSchema = require("./Player");
const GameRoundSummarySchema = require("./GameSummaryRound");

const GameSummarySchema = new Schema({
    rounds: {
        type: [GameRoundSummarySchema],
        default: undefined,
    },
    winners: {
        players: { type: [PlayerSchema] },
        team: { type: String },
    },
}, {
    id: false,
    timestamps: false,
    versionKey: false,
});

module.exports = GameSummarySchema;