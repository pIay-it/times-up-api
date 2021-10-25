const { Schema } = require("mongoose");
const { getCardCategories } = require("../../helpers/functions/Card");

const CardSchema = new Schema({
    label: {
        type: String,
        required: true,
    },
    categories: {
        type: [String],
        enum: getCardCategories(),
        required: true,
    },
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    description: { type: String },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = CardSchema;