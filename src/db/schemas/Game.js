const { Schema } = require("mongoose");
const CardSchema = require("./Card");
const PlayerSchema = require("./Player");
const GameSummarySchema = require("./GameSummary");
const GameOptionsSchema = require("./GameOptions");
const GameHistorySchema = require("./GameHistory");
const { getGameStatuses, getGameDefaultOptions } = require("../../helpers/functions/Game");

const GameSchema = new Schema({
    players: {
        type: [PlayerSchema],
        required: true,
    },
    cards: {
        type: [CardSchema],
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: getGameStatuses(),
        default: "preparing",
    },
    round: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
        max: 4,
    },
    turn: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
    speaker: { type: PlayerSchema },
    guesser: { type: PlayerSchema },
    summary: { type: GameSummarySchema },
    options: {
        type: GameOptionsSchema,
        default: getGameDefaultOptions(),
    },
    history: {
        type: [GameHistorySchema],
        default: undefined,
    },
}, {
    timestamps: true,
    versionKey: false,
});

GameSchema.post("save", doc => {
    doc.speaker = doc.players[0];
    doc.save();
});

module.exports = GameSchema;