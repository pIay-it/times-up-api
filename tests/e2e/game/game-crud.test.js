const { describe, it, before, after } = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");
const { getCardCategories } = require("../../../src/helpers/functions/Card");
const { resetDatabase, createDummyCards } = require("../../../src/helpers/functions/Test");
const { expect } = chai;
let server, game;
let players = [
    { name: "   Doudou    " },
    { name: "      <span>Juju</span>" },
    { name: " Toto  " },
    { name: "     Thom" },
];

chai.use(chaiHttp);
describe("A - Game CRUD [Create / Read / Update / Delete]", () => {
    before(done => resetDatabase(done));
    before(done => {
        server = app.listen(3000, done);
    });
    after(done => resetDatabase(done));
    it(`🤼 Can't create a game with twice the same player name (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .send({ players: [...players, { name: " <h1>     Toto   </h1>     " }] })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("PLAYERS_NAME_NOT_UNIQUE");
                done();
            });
    });
    createDummyCards();
    it(`🎲 Creates a game with 4 players and default options (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .send({ players })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                players = game.players;
                expect(game.players).to.be.an("array");
                expect(game.players.length).to.equal(4);
                expect(players[0].name).to.equal("Doudou");
                expect(players[0].team).to.equal("Bleue");
                expect(players[1].name).to.equal("Juju");
                expect(players[1].team).to.equal("Rouge");
                expect(players[2].name).to.equal("Toto");
                expect(players[2].team).to.equal("Bleue");
                expect(players[3].name).to.equal("Thom");
                expect(players[3].team).to.equal("Rouge");
                expect(game.cards).to.be.an("array");
                expect(game.cards.length).to.equal(40);
                expect(game.status).to.equal("preparing");
                expect(game.round).to.equal(1);
                expect(game.turn).to.equal(1);
                expect(game.speaker).to.deep.equal(players[0]);
                expect(game.guesser).to.not.exist;
                expect(game.options.players.areTeamUp).to.be.true;
                expect(game.options.cards.count).to.equal(40);
                expect(game.options.cards.categories).to.deep.equal(getCardCategories());
                expect(game.options.cards.difficulties).to.deep.equal([1, 2, 3]);
                expect(game.options.cards.helpers.areDisplayed).to.be.true;
                expect(game.options.rounds.count).to.equal(3);
                expect(game.options.rounds.turns.timeLimit).to.equal(30);
                expect(game.history).to.not.exist;
                done();
            });
    });
});