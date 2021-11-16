const { Schema } = require("mongoose");
const PlayerSchema = require("./Player");

const GameSummaryScoreSchema = new Schema({
    players: {
        type: [PlayerSchema],
        default: undefined,
    },
    team: { type: String },
    score: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = GameSummaryScoreSchema;