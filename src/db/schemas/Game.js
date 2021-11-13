const { Schema } = require("mongoose");
const CardSchema = require("./Card");
const PlayerSchema = require("./Player");
const GameQueueSchema = require("./GameQueue");
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
    queue: { type: [GameQueueSchema] },
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
    game.set("queue", game.firstQueue);
    game.setNextSpeakerAndRollQueue();
    game.save();
});

function isRoundOver() {
    return this.cards.every(card => card.isGuessed);
}

function isOver() {
    return this.isRoundOver && this.round === this.options.rounds.count;
}

function getFirstQueue() {
    const queue = [];
    for (const player of this.players) {
        const existingTeam = queue.find(({ team }) => team === player.team);
        if (!existingTeam) {
            queue.push({ team: player.team, players: [player] });
        } else {
            existingTeam.players.push(player);
        }
    }
    return queue;
}

function getNextSpeaker() {
    return this.queue[0].players[0];
}

GameSchema.virtual("isRoundOver").get(isRoundOver);
GameSchema.virtual("isOver").get(isOver);
GameSchema.virtual("firstQueue").get(getFirstQueue);
GameSchema.virtual("nextSpeaker").get(getNextSpeaker);

function getCardById(id) {
    return this.cards.find(({ _id }) => _id.toString() === id.toString());
}

function rollQueue() {
    this.queue[0].players.push(this.queue[0].players.shift());
    this.queue.push(this.queue.shift());
}

function setNextSpeakerAndRollQueue() {
    this.set("speaker", this.nextSpeaker);
    this.rollQueue();
}

function resetCardsForNewRound() {
    this.cards.forEach(card => {
        card.set("status", "to-guess");
        card.set("timeToGuess", undefined);
    });
}

GameSchema.methods.getCardById = getCardById;
GameSchema.methods.rollQueue = rollQueue;
GameSchema.methods.setNextSpeakerAndRollQueue = setNextSpeakerAndRollQueue;
GameSchema.methods.resetCardsForNewRound = resetCardsForNewRound;

module.exports = GameSchema;