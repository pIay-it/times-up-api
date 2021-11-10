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
            // eslint-disable-next-line new-cap
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
            // eslint-disable-next-line new-cap
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
            // eslint-disable-next-line new-cap
            .post(`/games/${game._id}/play`)
            // eslint-disable-next-line new-cap
            .send({ cards: [{ _id: cards[0]._id, status: "skipped" }] })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("CANT_SKIP_CARD");
                done();
            });
    });
    it(`🎲 Can't make a game play with twice the same card (POST /games/:id/play)`, done => {
        chai.request(server)
            // eslint-disable-next-line new-cap
            .post(`/games/${game._id}/play`)
            // eslint-disable-next-line new-cap
            .send({ cards: [{ _id: cards[0]._id, status: "skipped" }, { _id: cards[0]._id, status: "guessed" }] })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("CANT_PLAY_CARD_TWICE");
                done();
            });
    });
});