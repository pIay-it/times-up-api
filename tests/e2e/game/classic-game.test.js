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
    it(`🎲 First speaker made his team guess two cards and discarded the third (POST /games/:id/play)`, done => {
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
});