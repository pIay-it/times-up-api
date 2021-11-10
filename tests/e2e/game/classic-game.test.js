const mongoose = require("mongoose");
const { describe, it, before, after } = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");
const { resetDatabase, createDummyCards } = require("../../../src/helpers/functions/Test");
const { expect } = chai;
let server, game;
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
});