const { Schema } = require("mongoose");
const PlayerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    team: { type: String },
}, {
    timestamps: false,
    versionKey: false,
});

module.exports = PlayerSchema;