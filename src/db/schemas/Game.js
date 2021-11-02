const { Schema } = require("mongoose");
const CardSchema = require("./Card");
const PlayerSchema = require("./Player");
const { getGameStatuses, getGameDefaultOptions } = require("../../helpers/functions/Game");
const { getCardCategories } = require("../../helpers/functions/Card");

const gameHistory = {
    round: {
        type: Number,
        required: true,
        min: 1,
        max: 4,
    },
    cards: {
        type: [CardSchema],
        default: undefined,
    },
};

const gameOptions = {
    players: {
        areTeamUp: {
            type: Boolean,
            default: true,
        },
    },
    cards: {
        count: {
            type: Number,
            min: 5,
            max: 100,
            default: 40,
        },
        categories: {
            type: [String],
            default: getCardCategories(),
        },
        difficulties: {
            type: [Number],
            default: [1, 2, 3],
        },
        helpers: {
            areDisplayed: {
                type: Boolean,
                default: true,
            },
        },
    },
    rounds: {
        count: {
            type: Number,
            min: 3,
            max: 4,
            default: 3,
        },
        turns: {
            timeLimit: {
                type: Number,
                min: 10,
                max: 120,
                default: 30,
            },
        },
    },
};

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
    options: {
        type: gameOptions,
        default: getGameDefaultOptions(),
    },
    history: {
        type: [gameHistory],
        default: undefined,
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = GameSchema;