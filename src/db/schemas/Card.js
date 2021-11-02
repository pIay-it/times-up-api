const { Schema } = require("mongoose");
const PlayerSchema = require("./Player");
const { getCardCategories } = require("../../helpers/functions/Card");

const CardSchema = new Schema({
    label: { type: String },
    categories: {
        type: [String],
        enum: getCardCategories(),
        default: undefined,
    },
    difficulty: {
        type: Number,
        min: 1,
        max: 3,
    },
    guessed: {
        from: {
            type: PlayerSchema,
            required: true,
        },
        by: { type: PlayerSchema },
    },
    description: { type: String },
    imageURL: { type: String },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = CardSchema;