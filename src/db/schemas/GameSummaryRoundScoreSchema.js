const { Schema } = require("mongoose");
const PlayerSchema = require("./Player");

const GameSummaryRoundScoreSchema = new Schema({
    team: { type: String },
    player: { type: PlayerSchema },
    score: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = GameSummaryRoundScoreSchema;