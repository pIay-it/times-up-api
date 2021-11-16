const mongoose = require("mongoose");
const { describe, it, before, after } = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");
const { resetDatabase, createDummyCards } = require("../../../src/helpers/functions/Test");
const Config = require("../../../config");
const { expect } = chai;
let server, game, cards;
const players = [
    { name: "Doudou" },
    { name: "Juju" },
    { name: "Toto" },
    { name: "Thom" },
];

chai.use(chaiHttp);
describe("B - Classic game with 4 players", () => {
    before(done => resetDatabase(done));
    before(done => {
        server = app.listen(3000, done);
    });
    after(done => resetDatabase(done));
    createDummyCards();
    it(`🎲 Creates a classic game with 4 players and default options (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .send({ players })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                cards = game.cards;
                expect(game.status).to.equal("preparing");
                done();
            });
    });
    it(`❓  Can't make a game play into an unknown game (POST /games/:id/play)`, done => {
        chai.request(server)
            // eslint-disable-next-line new-cap
            .post(`/games/${mongoose.Types.ObjectId()}/play`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("GAME_NOT_FOUND");
                done();
            });
    });
    it(`🎲 Can't make a game play into a game not "playing" (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("GAME_NOT_PLAYING");
                done();
            });
    });
    it(`🎲 Update the game to "playing" status (PATCH /games/:id)`, done => {
        chai.request(server)
            .patch(`/games/${game._id}`)
            .auth(Config.app.basicAuth.username, Config.app.basicAuth.password)
            .send({ status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                expect(game.status).to.equal("playing");
                done();
            });
    });
    it(`🎲 Can't make a game play with one card not belonging to the game (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            // eslint-disable-next-line new-cap
            .send({ cards: [{ _id: mongoose.Types.ObjectId(), status: "discarded" }] })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("CARD_NOT_IN_GAME");
                done();
            });
    });
    it(`🎲 Can't make a game play with one skipped card during first game's round (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({ cards: [{ _id: cards[0]._id, status: "skipped" }] })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("CANT_SKIP_CARD");
                done();
            });
    });
    it(`🎲 Can't make a game play with twice the same card (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({ cards: [{ _id: cards[0]._id, status: "skipped" }, { _id: cards[0]._id, status: "guessed" }] })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("CANT_PLAY_CARD_TWICE");
                done();
            });
    });
    it(`🎲 Can't make a game play with a card containing a "timeToGuess" and status not set to "guessed" (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({ cards: [{ _id: cards[0]._id, status: "discarded", timeToGuess: 10 }] })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("FORBIDDEN_TIME_TO_GUESS");
                done();
            });
    });
    it(`🎲 Can't make a game play with a card with status set to "guessed" and missing "timeToPlay" value (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({ cards: [{ _id: cards[0]._id, status: "guessed" }] })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("MISSING_TIME_TO_GUESS");
                done();
            });
    });
    it(`🎲 First speaker of the first team made his team guess two cards and discarded the third (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({
                cards: [
                    { _id: cards[0]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[1]._id, status: "guessed", timeToGuess: 10 },
                    { _id: cards[2]._id, status: "discarded" },
                ],
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                expect(game.cards[0].status).to.equal("guessed");
                expect(game.cards[0].timeToGuess).to.equal(2);
                expect(game.cards[1].status).to.equal("guessed");
                expect(game.cards[1].timeToGuess).to.equal(10);
                expect(game.cards[2].status).to.equal("to-guess");
                expect(game.cards[2].timeToGuess).to.not.exist;
                expect(game.round).to.equal(1);
                expect(game.turn).to.equal(2);
                expect(game.speaker._id).to.equal(game.players[1]._id);
                expect(game.queue).to.exist;
                expect(game.queue).to.be.an("array");
                expect(game.queue.length).to.equal(2);
                expect(game.queue[0].team).to.equal("Bleue");
                expect(game.queue[0].players.length).to.equal(2);
                expect(game.queue[0].players).to.be.an("array");
                expect(game.queue[0].players[0]._id).to.equal(game.players[2]._id);
                expect(game.queue[0].players[1]._id).to.equal(game.players[0]._id);
                expect(game.queue[1].team).to.equal("Rouge");
                expect(game.queue[1].players.length).to.equal(2);
                expect(game.queue[1].players[0]._id).to.equal(game.players[3]._id);
                expect(game.queue[1].players[1]._id).to.equal(game.players[1]._id);
                expect(game.summary).to.not.exist;
                expect(game.history).to.be.an("array");
                expect(game.history.length).to.equal(1);
                expect(game.history[0].round).to.equal(1);
                expect(game.history[0].turn).to.equal(1);
                expect(game.history[0].speaker._id).to.equal(game.players[0]._id);
                expect(game.history[0].guesser).to.not.exist;
                expect(game.history[0].cards).to.be.an("array");
                expect(game.history[0].cards.length).to.equal(3);
                expect(game.history[0].cards[0]._id).to.equal(cards[0]._id);
                expect(game.history[0].cards[0].status).to.equal("guessed");
                expect(game.history[0].cards[0].timeToGuess).to.equal(2);
                expect(game.history[0].cards[1]._id).to.equal(cards[1]._id);
                expect(game.history[0].cards[1].status).to.equal("guessed");
                expect(game.history[0].cards[1].timeToGuess).to.equal(10);
                expect(game.history[0].cards[2]._id).to.equal(cards[2]._id);
                expect(game.history[0].cards[2].status).to.equal("discarded");
                expect(game.history[0].cards[2].timeToGuess).to.not.exist;
                expect(game.history[0].score).to.equal(2);
                done();
            });
    });
    it(`🎲 Can't make a game play with a guessed card which was already guessed (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({ cards: [{ _id: cards[0]._id, status: "guessed", timeToGuess: 2 }] })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("CARD_ALREADY_GUESSED");
                done();
            });
    });
    it(`🎲 First speaker of the second team made his team guess five cards (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({
                cards: [
                    { _id: cards[3]._id, status: "guessed", timeToGuess: 3 },
                    { _id: cards[4]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[5]._id, status: "guessed", timeToGuess: 5 },
                    { _id: cards[6]._id, status: "guessed", timeToGuess: 6 },
                    { _id: cards[7]._id, status: "guessed", timeToGuess: 7 },
                ],
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                expect(game.round).to.equal(1);
                expect(game.turn).to.equal(3);
                expect(game.speaker._id).to.equal(game.players[2]._id);
                expect(game.queue[0].team).to.equal("Rouge");
                expect(game.queue[0].players.length).to.equal(2);
                expect(game.queue[0].players).to.be.an("array");
                expect(game.queue[0].players[0]._id).to.equal(game.players[3]._id);
                expect(game.queue[0].players[1]._id).to.equal(game.players[1]._id);
                expect(game.queue[1].team).to.equal("Bleue");
                expect(game.queue[1].players.length).to.equal(2);
                expect(game.queue[1].players[0]._id).to.equal(game.players[0]._id);
                expect(game.queue[1].players[1]._id).to.equal(game.players[2]._id);
                expect(game.history).to.be.an("array");
                expect(game.history.length).to.equal(2);
                expect(game.history[0].round).to.equal(1);
                expect(game.history[0].turn).to.equal(2);
                expect(game.history[0].speaker._id).to.equal(game.players[1]._id);
                expect(game.history[0].guesser).to.not.exist;
                expect(game.history[0].score).to.equal(5);
                done();
            });
    });
    it(`🎲 Second speaker of the first team made his team guess ten cards (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({
                cards: [
                    { _id: cards[8]._id, status: "guessed", timeToGuess: 3 },
                    { _id: cards[9]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[10]._id, status: "guessed", timeToGuess: 5 },
                    { _id: cards[11]._id, status: "guessed", timeToGuess: 6 },
                    { _id: cards[12]._id, status: "guessed", timeToGuess: 7 },
                    { _id: cards[13]._id, status: "guessed", timeToGuess: 6 },
                    { _id: cards[14]._id, status: "guessed", timeToGuess: 5 },
                    { _id: cards[15]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[16]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[17]._id, status: "guessed", timeToGuess: 2 },
                ],
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                expect(game.round).to.equal(1);
                expect(game.turn).to.equal(4);
                expect(game.speaker._id).to.equal(game.players[3]._id);
                expect(game.queue[0].team).to.equal("Bleue");
                expect(game.queue[0].players.length).to.equal(2);
                expect(game.queue[0].players).to.be.an("array");
                expect(game.queue[0].players[0]._id).to.equal(game.players[0]._id);
                expect(game.queue[0].players[1]._id).to.equal(game.players[2]._id);
                expect(game.queue[1].team).to.equal("Rouge");
                expect(game.queue[1].players.length).to.equal(2);
                expect(game.queue[1].players[0]._id).to.equal(game.players[1]._id);
                expect(game.queue[1].players[1]._id).to.equal(game.players[3]._id);
                expect(game.history).to.be.an("array");
                expect(game.history.length).to.equal(3);
                expect(game.history[0].round).to.equal(1);
                expect(game.history[0].turn).to.equal(3);
                expect(game.history[0].speaker._id).to.equal(game.players[2]._id);
                expect(game.history[0].guesser).to.not.exist;
                expect(game.history[0].score).to.equal(10);
                done();
            });
    });
    it(`🎲 Second speaker of the second team made his team guess eleven cards (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({
                cards: [
                    { _id: cards[18]._id, status: "guessed", timeToGuess: 3 },
                    { _id: cards[19]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[20]._id, status: "guessed", timeToGuess: 5 },
                    { _id: cards[21]._id, status: "guessed", timeToGuess: 6 },
                    { _id: cards[22]._id, status: "guessed", timeToGuess: 7 },
                    { _id: cards[23]._id, status: "guessed", timeToGuess: 6 },
                    { _id: cards[24]._id, status: "guessed", timeToGuess: 5 },
                    { _id: cards[25]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[26]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[27]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[28]._id, status: "guessed", timeToGuess: 2 },
                ],
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                expect(game.round).to.equal(1);
                expect(game.turn).to.equal(5);
                expect(game.speaker._id).to.equal(game.players[0]._id);
                expect(game.queue[0].team).to.equal("Rouge");
                expect(game.queue[0].players.length).to.equal(2);
                expect(game.queue[0].players).to.be.an("array");
                expect(game.queue[0].players[0]._id).to.equal(game.players[1]._id);
                expect(game.queue[0].players[1]._id).to.equal(game.players[3]._id);
                expect(game.queue[1].team).to.equal("Bleue");
                expect(game.queue[1].players.length).to.equal(2);
                expect(game.queue[1].players[0]._id).to.equal(game.players[2]._id);
                expect(game.queue[1].players[1]._id).to.equal(game.players[0]._id);
                expect(game.history).to.be.an("array");
                expect(game.history.length).to.equal(4);
                expect(game.history[0].round).to.equal(1);
                expect(game.history[0].turn).to.equal(4);
                expect(game.history[0].speaker._id).to.equal(game.players[3]._id);
                expect(game.history[0].guesser).to.not.exist;
                expect(game.history[0].score).to.equal(11);
                done();
            });
    });
    it(`🎲 First speaker of the first team made his team guess all remaining cards, round 2 starts after this play (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({
                cards: [
                    { _id: cards[2]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[29]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[30]._id, status: "guessed", timeToGuess: 5 },
                    { _id: cards[31]._id, status: "guessed", timeToGuess: 6 },
                    { _id: cards[32]._id, status: "guessed", timeToGuess: 7 },
                    { _id: cards[33]._id, status: "guessed", timeToGuess: 6 },
                    { _id: cards[34]._id, status: "guessed", timeToGuess: 5 },
                    { _id: cards[35]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[36]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[37]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[38]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[39]._id, status: "guessed", timeToGuess: 2 },
                ],
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                expect(game.cards.every(({ status }) => status === "to-guess")).to.be.true;
                expect(game.round).to.equal(2);
                expect(game.turn).to.equal(1);
                expect(game.speaker._id).to.equal(game.players[1]._id);
                expect(game.queue[0].team).to.equal("Bleue");
                expect(game.queue[0].players.length).to.equal(2);
                expect(game.queue[0].players).to.be.an("array");
                expect(game.queue[0].players[0]._id).to.equal(game.players[2]._id);
                expect(game.queue[0].players[1]._id).to.equal(game.players[0]._id);
                expect(game.queue[1].team).to.equal("Rouge");
                expect(game.queue[1].players.length).to.equal(2);
                expect(game.queue[1].players[0]._id).to.equal(game.players[3]._id);
                expect(game.queue[1].players[1]._id).to.equal(game.players[1]._id);
                expect(game.summary).to.exist;
                expect(game.summary.rounds).to.be.an("array");
                expect(game.summary.rounds.length).to.equal(1);
                expect(game.summary.rounds[0].number).to.equal(1);
                expect(game.summary.rounds[0].scores).to.be.an("array");
                expect(game.summary.rounds[0].scores.length).to.equal(2);
                expect(game.summary.rounds[0].scores[0].team).to.equal("Bleue");
                expect(game.summary.rounds[0].scores[0].score).to.equal(24);
                expect(game.summary.rounds[0].scores[1].team).to.equal("Rouge");
                expect(game.summary.rounds[0].scores[1].score).to.equal(16);
                expect(game.history).to.be.an("array");
                expect(game.history.length).to.equal(5);
                expect(game.history[0].round).to.equal(1);
                expect(game.history[0].turn).to.equal(5);
                expect(game.history[0].speaker._id).to.equal(game.players[0]._id);
                expect(game.history[0].guesser).to.not.exist;
                expect(game.history[0].score).to.equal(12);
                done();
            });
    });
    it(`🎲 First speaker of the second team made his team guess 10 cards and skipped 2 (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({
                cards: [
                    { _id: cards[0]._id, status: "skipped" },
                    { _id: cards[1]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[2]._id, status: "guessed", timeToGuess: 5 },
                    { _id: cards[3]._id, status: "guessed", timeToGuess: 6 },
                    { _id: cards[4]._id, status: "guessed", timeToGuess: 7 },
                    { _id: cards[5]._id, status: "guessed", timeToGuess: 6 },
                    { _id: cards[6]._id, status: "skipped" },
                    { _id: cards[7]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[8]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[9]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[10]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[11]._id, status: "guessed", timeToGuess: 2 },
                ],
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                expect(game.round).to.equal(2);
                expect(game.turn).to.equal(2);
                expect(game.speaker._id).to.equal(game.players[2]._id);
                expect(game.history.length).to.equal(6);
                expect(game.history[0].round).to.equal(2);
                expect(game.history[0].turn).to.equal(1);
                expect(game.history[0].speaker._id).to.equal(game.players[1]._id);
                expect(game.history[0].score).to.equal(10);
                done();
            });
    });
    it(`🎲 Second speaker of the first team made his team guess 12 cards (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({
                cards: [
                    { _id: cards[0]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[6]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[12]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[13]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[14]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[15]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[16]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[17]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[18]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[19]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[20]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[21]._id, status: "guessed", timeToGuess: 2 },
                ],
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                expect(game.round).to.equal(2);
                expect(game.turn).to.equal(3);
                expect(game.speaker._id).to.equal(game.players[3]._id);
                expect(game.history.length).to.equal(7);
                expect(game.history[0].round).to.equal(2);
                expect(game.history[0].turn).to.equal(2);
                expect(game.history[0].speaker._id).to.equal(game.players[2]._id);
                expect(game.history[0].score).to.equal(12);
                done();
            });
    });
    it(`🎲 Second speaker of the second team made his team guess all remaining cards, round 3 starts after this play (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({
                cards: [
                    { _id: cards[22]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[23]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[24]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[25]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[26]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[27]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[28]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[29]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[30]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[31]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[32]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[33]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[34]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[35]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[36]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[37]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[38]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[39]._id, status: "guessed", timeToGuess: 2 },
                ],
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                expect(game.round).to.equal(3);
                expect(game.turn).to.equal(1);
                expect(game.speaker._id).to.equal(game.players[0]._id);
                expect(game.summary.rounds.length).to.equal(2);
                expect(game.summary.rounds[1].number).to.equal(2);
                expect(game.summary.rounds[1].scores).to.be.an("array");
                expect(game.summary.rounds[1].scores.length).to.equal(2);
                expect(game.summary.rounds[1].scores[0].team).to.equal("Rouge");
                expect(game.summary.rounds[1].scores[0].score).to.equal(28);
                expect(game.summary.rounds[1].scores[1].team).to.equal("Bleue");
                expect(game.summary.rounds[1].scores[1].score).to.equal(12);
                expect(game.history.length).to.equal(8);
                expect(game.history[0].round).to.equal(2);
                expect(game.history[0].turn).to.equal(3);
                expect(game.history[0].speaker._id).to.equal(game.players[3]._id);
                expect(game.history[0].score).to.equal(18);
                done();
            });
    });
    it(`🎲 First speaker of the first team made his team guess all cards in once, what a beast, game is over (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({
                cards: [
                    { _id: cards[0]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[1]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[2]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[3]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[4]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[5]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[6]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[7]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[8]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[9]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[10]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[11]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[12]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[13]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[14]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[15]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[16]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[17]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[18]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[19]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[20]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[21]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[22]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[23]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[24]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[25]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[26]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[27]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[28]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[29]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[30]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[31]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[32]._id, status: "guessed", timeToGuess: 4 },
                    { _id: cards[33]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[34]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[35]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[36]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[37]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[38]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[39]._id, status: "guessed", timeToGuess: 2 },
                ],
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                expect(game.round).to.equal(3);
                expect(game.turn).to.equal(1);
                expect(game.speaker._id).to.equal(game.players[0]._id);
                expect(game.status).to.equal("over");
                expect(game.summary.rounds.length).to.equal(3);
                expect(game.summary.rounds[2].number).to.equal(3);
                expect(game.summary.rounds[2].scores).to.be.an("array");
                expect(game.summary.rounds[2].scores.length).to.equal(1);
                expect(game.summary.rounds[2].scores[0].team).to.equal("Bleue");
                expect(game.summary.rounds[2].scores[0].score).to.equal(40);
                expect(game.summary.finalScores).to.exist;
                expect(game.summary.finalScores).to.be.an("array");
                expect(game.summary.finalScores.length).to.equal(2);
                expect(game.summary.finalScores[0].team).to.equal("Bleue");
                expect(game.summary.finalScores[0].score).to.equal(40 + 12 + 24);
                expect(game.summary.finalScores[1].team).to.equal("Rouge");
                expect(game.summary.finalScores[1].score).to.equal(28 + 16);
                expect(game.summary.winners).to.exist;
                expect(game.summary.winners.teams).to.be.an("array");
                expect(game.summary.winners.teams.length).to.equal(1);
                expect(game.summary.winners.teams[0]).to.equal("Bleue");
                expect(game.summary.winners.players.every(({ team }) => team === "Bleue")).to.be.true;
                expect(game.history.length).to.equal(9);
                expect(game.history[0].round).to.equal(3);
                expect(game.history[0].turn).to.equal(1);
                expect(game.history[0].speaker._id).to.equal(game.players[0]._id);
                expect(game.history[0].score).to.equal(40);
                done();
            });
    });
    it(`🎲 Can't make a play if the game is over (POST /games/:id/play)`, done => {
        chai.request(server)
            .post(`/games/${game._id}/play`)
            .send({
                cards: [
                    { _id: cards[22]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[23]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[24]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[25]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[26]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[27]._id, status: "guessed", timeToGuess: 2 },
                    { _id: cards[28]._id, status: "guessed", timeToGuess: 2 },
                ],
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("GAME_NOT_PLAYING");
                done();
            });
    });
});