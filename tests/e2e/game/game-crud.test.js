const { describe, it, before, after } = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");
const { getCardCategories } = require("../../../src/helpers/functions/Card");
const { resetDatabase, createDummyCards } = require("../../../src/helpers/functions/Test");
const Config = require("../../../config");
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
    it(`🎲 Creates a fast game with 4 players, default options and "playing" status to start (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .send({ players, status: "playing" })
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
                expect(game.status).to.equal("playing");
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
    it(`🎲 Creates another fast game with 5 players, default options and "preparing" status to start (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .send({ players: [...players, { name: "Nana" }] })
            .end((err, res) => {
                expect(res).to.have.status(200);
                game = res.body;
                players = game.players;
                expect(game.players).to.be.an("array");
                expect(game.players.length).to.equal(5);
                expect(players[0].name).to.equal("Doudou");
                expect(players[0].team).to.equal("Bleue");
                expect(players[1].name).to.equal("Juju");
                expect(players[1].team).to.equal("Rouge");
                expect(players[2].name).to.equal("Toto");
                expect(players[2].team).to.equal("Bleue");
                expect(players[3].name).to.equal("Thom");
                expect(players[3].team).to.equal("Rouge");
                expect(players[4].name).to.equal("Nana");
                expect(players[4].team).to.equal("Bleue");
                expect(game.cards).to.be.an("array");
                expect(game.status).to.equal("preparing");
                expect(game.history).to.not.exist;
                done();
            });
    });
    it(`🔒 Can't get all available games without basic authentication (GET /games)`, done => {
        chai.request(server)
            .get("/games")
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("UNAUTHORIZED");
                done();
            });
    });
    it(`🎲 Get all available games (GET /games)`, done => {
        chai.request(server)
            .get("/games")
            .auth(Config.app.basicAuth.username, Config.app.basicAuth.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const games = res.body;
                expect(games).to.be.an("array");
                expect(games.length).to.equal(2);
                done();
            });
    });
    it(`🎲 Get only one game from the two (GET /games?limit=1)`, done => {
        chai.request(server)
            .get("/games?limit=1")
            .auth(Config.app.basicAuth.username, Config.app.basicAuth.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const games = res.body;
                expect(games).to.be.an("array");
                expect(games.length).to.equal(1);
                done();
            });
    });
    it(`🎲 Get all available games with "players" field only (GET /games?fields=players)`, done => {
        chai.request(server)
            .get("/games?fields=players")
            .auth(Config.app.basicAuth.username, Config.app.basicAuth.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const games = res.body;
                expect(games).to.be.an("array");
                expect(games.length).to.equal(2);
                expect(games.every(g => g.players && !g.cards && !g.options && !g.createdAt && !g.updatedAt)).to.be.true;
                done();
            });
    });
});