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

GameSchema.post("save", game => {
    game.speaker = game.players[0];
    game.save();
});

function getCardById(id) {
    return this.cards.find(({ _id }) => _id.toString() === id.toString());
}

function isRoundOverAfterGamePlay(play) {
    return this.cards.every(card => {
        const playedCard = play.cards?.find(({ _id }) => _id.toString() === card._id.toString());
        return card.isGuessed || playedCard.status === "guessed";
    });
}

function isGameOverAfterGamePlay(play) {
    return this.isRoundOverAfterGamePlay(play) && this.round === this.options.rounds.count;
}

GameSchema.methods.getCardById = getCardById;
GameSchema.methods.isRoundOverAfterGamePlay = isRoundOverAfterGamePlay;
GameSchema.methods.isGameOverAfterGamePlay = isGameOverAfterGamePlay;

module.exports = GameSchema;