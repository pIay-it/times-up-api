const { Schema } = require("mongoose");
const { getCardCategories } = require("../../helpers/functions/Card");

const GameHistorySchema = new Schema({
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
}, {
    id: false,
    timestamps: false,
    versionKey: false,
});

module.exports = GameHistorySchema;