const { Schema } = require("mongoose");
const PlayerSchema = require("./Player");

const GameQueueSchema = new Schema({
    team: { type: String },
    players: {
        type: [PlayerSchema],
        required: true,
    },
}, {
    timestamps: false,
    versionKey: false,
});

module.exports = GameQueueSchema;