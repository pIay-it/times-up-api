const { Schema } = require("mongoose");
const { shuffle: shuffleArray } = require("lodash");
const CardSchema = require("./Card");
const PlayerSchema = require("./Player");
const GameQueueSchema = require("./GameQueue");
const GameSummarySchema = require("./GameSummary");
const GameOptionsSchema = require("./GameOptions");
const GameHistorySchema = require("./GameHistory");
const { getGameStatuses, getGameDefaultOptions, getGameCardById } = require("../../helpers/functions/Game");
const { generateError } = require("../../helpers/functions/Error");

const AnonymousUserSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
}, {
    _id: false,
    timestamps: false,
    versionKey: false,
});

const GameSchema = new Schema({
    players: {
        type: [PlayerSchema],
        required: true,
    },
    cards: {
        type: [CardSchema],
        required: true,
    },
    anonymousUser: { type: AnonymousUserSchema },
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

function getPlayerTeams() {
    return [...new Set(this.players.map(player => player.team))];
}

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

GameSchema.virtual("getPlayerTeams").get(getPlayerTeams);
GameSchema.virtual("isRoundOver").get(isRoundOver);
GameSchema.virtual("isOver").get(isOver);
GameSchema.virtual("firstQueue").get(getFirstQueue);
GameSchema.virtual("nextSpeaker").get(getNextSpeaker);

function checkBelongsToUserFromReq(req) {
    if (req?.user?.strategy === "JWT") {
        const { mode, _id } = req.user;
        if (mode === "anonymous" && (!this.anonymousUser || _id.toString() !== this.anonymousUser?._id.toString())) {
            throw generateError("GAME_DOESNT_BELONG_TO_USER", `Game with id ${this._id} doesn't belong to user with id "${_id}".`);
        }
    }
}

function getCardById(id) {
    return getGameCardById(this, id);
}

function getPlayersByTeam(team) {
    return this.players.filter(player => player.team === team);
}

function rollQueue() {
    this.queue[0].players.push(this.queue[0].players.shift());
    this.queue.push(this.queue.shift());
}

function setNextSpeakerAndRollQueue() {
    this.set("speaker", this.nextSpeaker);
    this.rollQueue();
}

function unshiftHistoryEntry(play) {
    const newGameHistoryEntry = {
        round: this.round,
        turn: this.turn,
        speaker: this.speaker,
        guesser: this.guesser,
        cards: play.cards,
        score: play.cards.reduce((acc, { status }) => status === "guessed" ? acc + 1 : acc, 0),
    };
    const gameHistory = this.history ? [newGameHistoryEntry, ...this.history] : [newGameHistoryEntry];
    this.set("history", gameHistory);
}

function pushSummaryRound() {
    const roundPlays = this.history.filter(({ round }) => round === this.round);
    const teams = this.getPlayerTeams;
    const roundScores = teams.reduce((acc, team) => [...acc, { team, players: this.getPlayersByTeam(team), score: 0 }], []);
    const gameSummaryRound = {
        number: this.round,
        scores: roundPlays.reduce((acc, play) => {
            const existingTeamScore = acc.find(({ team }) => team === play.speaker.team);
            if (existingTeamScore) {
                existingTeamScore.score += play.score;
            }
            return acc;
        }, roundScores),
    };
    if (!this.summary) {
        this.set("summary", { rounds: [gameSummaryRound] });
    } else {
        this.set("summary.rounds", [...this.summary.rounds, gameSummaryRound]);
    }
}

function resetCardsForNewRound() {
    this.cards.forEach(card => {
        card.set("status", "to-guess");
        card.set("playingTime", undefined);
    });
}

function turnNotToGuessCardReducer(acc, card) {
    return card.status !== "to-guess" ? [...acc, card._id.toString()] : acc;
}

function shuffleCards(isFirstCardLocked) {
    const oldDeck = [...this.cards];
    let newDeck;
    if (!isFirstCardLocked) {
        newDeck = shuffleArray(oldDeck);
    } else {
        let firstToGuessCard;
        const turnNotToGuessCardIds = this.history?.length ? this.history[0].cards.reduce(turnNotToGuessCardReducer, []) : [];
        const firstToGuessCardIdx = oldDeck.findIndex(card => card.status === "to-guess" && !turnNotToGuessCardIds.includes(card._id.toString()));
        if (firstToGuessCardIdx !== -1) {
            firstToGuessCard = oldDeck[firstToGuessCardIdx];
            oldDeck.splice(firstToGuessCardIdx, 1);
        }
        newDeck = firstToGuessCard ? [firstToGuessCard, ...shuffleArray(oldDeck)] : shuffleArray(oldDeck);
    }
    this.set("cards", newDeck);
}

function setFinalSummary() {
    const finalScores = this.summary.rounds.reduce((acc, round) => {
        round.scores.forEach(roundScore => {
            const existingTeamFinalScore = acc.find(({ team }) => team === roundScore.team);
            if (existingTeamFinalScore) {
                existingTeamFinalScore.score += roundScore.score;
            } else {
                acc.push({ team: roundScore.team, players: roundScore.players, score: roundScore.score });
            }
        });
        return acc;
    }, []);
    this.set("summary.finalScores", finalScores);
    const highestFinalScore = Math.max(...finalScores.map(({ score }) => score));
    const winningTeams = finalScores.reduce((acc, { score, team }) => score === highestFinalScore ? [...acc, team] : acc, []);
    const winners = {
        teams: winningTeams,
        players: this.players.filter(({ team }) => winningTeams.includes(team)),
    };
    this.set("summary.winners", winners);
}

GameSchema.methods.checkBelongsToUserFromReq = checkBelongsToUserFromReq;
GameSchema.methods.getCardById = getCardById;
GameSchema.methods.getPlayersByTeam = getPlayersByTeam;
GameSchema.methods.rollQueue = rollQueue;
GameSchema.methods.setNextSpeakerAndRollQueue = setNextSpeakerAndRollQueue;
GameSchema.methods.unshiftHistoryEntry = unshiftHistoryEntry;
GameSchema.methods.pushSummaryRound = pushSummaryRound;
GameSchema.methods.resetCardsForNewRound = resetCardsForNewRound;
GameSchema.methods.shuffleCards = shuffleCards;
GameSchema.methods.setFinalSummary = setFinalSummary;

module.exports = GameSchema;