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
    const gameSummaryRound = {
        number: this.round,
        scores: roundPlays.reduce((acc, play) => {
            const existingTeamScore = acc.find(({ team }) => team === play.speaker.team);
            if (existingTeamScore) {
                existingTeamScore.score += play.score;
            } else {
                acc.push({ team: play.speaker.team, players: this.getPlayersByTeam(play.speaker.team), score: play.score });
            }
            return acc;
        }, []),
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
        card.set("timeToGuess", undefined);
    });
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

GameSchema.methods.getCardById = getCardById;
GameSchema.methods.getPlayersByTeam = getPlayersByTeam;
GameSchema.methods.rollQueue = rollQueue;
GameSchema.methods.setNextSpeakerAndRollQueue = setNextSpeakerAndRollQueue;
GameSchema.methods.unshiftHistoryEntry = unshiftHistoryEntry;
GameSchema.methods.pushSummaryRound = pushSummaryRound;
GameSchema.methods.resetCardsForNewRound = resetCardsForNewRound;
GameSchema.methods.setFinalSummary = setFinalSummary;

module.exports = GameSchema;