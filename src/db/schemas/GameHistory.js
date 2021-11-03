const { Schema } = require("mongoose");
const CardSchema = require("./Card");
const PlayerSchema = require("./Player");

const GameHistorySchema = new Schema({
    round: {
        type: Number,
        required: true,
        min: 1,
        max: 4,
    },
    turn: {
        type: Number,
        required: true,
        min: 1,
    },
    speaker: {
        type: PlayerSchema,
        required: true,
    },
    guesser: { type: PlayerSchema },
    cards: {
        type: [CardSchema],
        default: undefined,
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = GameHistorySchema;