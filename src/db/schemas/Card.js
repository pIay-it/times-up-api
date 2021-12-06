const { Schema } = require("mongoose");
const { getCardCategories, getCardStatuses } = require("../../helpers/functions/Card");

const CardSchema = new Schema({
    label: { type: String },
    status: {
        type: String,
        enum: getCardStatuses(),
    },
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
    playingTime: {
        type: Number,
        min: 0,
    },
    description: { type: String },
    imageURL: { type: String },
}, {
    timestamps: true,
    versionKey: false,
});

function isGuessed() {
    return this.status === "guessed";
}

CardSchema.virtual("isGuessed").get(isGuessed);

module.exports = CardSchema;