const mongoose = require("mongoose");
const { describe, it, before, after } = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");
const { getCardCategories } = require("../../../src/helpers/functions/Card");
const { resetDatabase, createDummyCards } = require("../../../src/helpers/functions/Test");
const Config = require("../../../config");
const { expect } = chai;
let server, firstGame, secondGame;
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
                firstGame = res.body;
                players = firstGame.players;
                expect(firstGame.players).to.be.an("array");
                expect(firstGame.players.length).to.equal(4);
                expect(players[0].name).to.equal("Doudou");
                expect(players[0].team).to.equal("Bleue");
                expect(players[1].name).to.equal("Juju");
                expect(players[1].team).to.equal("Rouge");
                expect(players[2].name).to.equal("Toto");
                expect(players[2].team).to.equal("Bleue");
                expect(players[3].name).to.equal("Thom");
                expect(players[3].team).to.equal("Rouge");
                expect(firstGame.cards).to.be.an("array");
                expect(firstGame.cards.length).to.equal(40);
                expect(firstGame.status).to.equal("playing");
                expect(firstGame.round).to.equal(1);
                expect(firstGame.turn).to.equal(1);
                expect(firstGame.speaker).to.deep.equal(players[0]);
                expect(firstGame.guesser).to.not.exist;
                expect(firstGame.options.players.areTeamUp).to.be.true;
                expect(firstGame.options.cards.count).to.equal(40);
                expect(firstGame.options.cards.categories).to.deep.equal(getCardCategories());
                expect(firstGame.options.cards.difficulties).to.deep.equal([1, 2, 3]);
                expect(firstGame.options.cards.helpers.areDisplayed).to.be.true;
                expect(firstGame.options.rounds.count).to.equal(3);
                expect(firstGame.options.rounds.turns.timeLimit).to.equal(30);
                expect(firstGame.history).to.not.exist;
                expect(firstGame.summary).to.not.exist;
                done();
            });
    });
    it(`🎲 Creates another fast game with 5 players, default options and "preparing" status to start (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .send({ players: [...players, { name: "Nana" }] })
            .end((err, res) => {
                expect(res).to.have.status(200);
                secondGame = res.body;
                players = secondGame.players;
                expect(secondGame.players).to.be.an("array");
                expect(secondGame.players.length).to.equal(5);
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
                expect(secondGame.cards).to.be.an("array");
                expect(secondGame.status).to.equal("preparing");
                expect(secondGame.history).to.not.exist;
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
                expect(games.every(game => game.players && !game.cards && !game.options && !game.createdAt && !game.updatedAt)).to.be.true;
                done();
            });
    });
    it(`❓  Can't get an unknown game (GET /game/:id)`, done => {
        chai.request(server)
            // eslint-disable-next-line new-cap
            .get(`/games/${mongoose.Types.ObjectId()}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("NOT_FOUND");
                done();
            });
    });
    it(`🎲 Get the first game created (GET /games/:id)`, done => {
        chai.request(server)
            .get(`/games/${firstGame._id}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const game = res.body;
                expect(game._id).to.be.equal(firstGame._id);
                done();
            });
    });
    it(`🔒 Can't update a game without basic authentication (PATCH /games/:id)`, done => {
        chai.request(server)
            .patch(`/games/${firstGame._id}`)
            .send({ status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("UNAUTHORIZED");
                done();
            });
    });
    it(`❓  Can't update an unknown game (PATCH /games/:id)`, done => {
        chai.request(server)
            // eslint-disable-next-line new-cap
            .patch(`/games/${mongoose.Types.ObjectId()}`)
            .auth(Config.app.basicAuth.username, Config.app.basicAuth.password)
            .send({ status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("NOT_FOUND");
                done();
            });
    });
    it(`🎲 Update the first game created (PATCH /games/:id)`, done => {
        chai.request(server)
            .patch(`/games/${firstGame._id}`)
            .auth(Config.app.basicAuth.username, Config.app.basicAuth.password)
            .send({ status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const game = res.body;
                expect(game._id).to.equal(firstGame._id);
                firstGame = game;
                expect(firstGame.status).to.equal("playing");
                done();
            });
    });
    it(`🔒 Can't delete a game without basic authentication (DELETE /games/:id)`, done => {
        chai.request(server)
            .delete(`/games/${firstGame._id}`)
            .send({ status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("UNAUTHORIZED");
                done();
            });
    });
    it(`❓  Can't delete an unknown game (DELETE /games/:id)`, done => {
        chai.request(server)
            // eslint-disable-next-line new-cap
            .delete(`/games/${mongoose.Types.ObjectId()}`)
            .auth(Config.app.basicAuth.username, Config.app.basicAuth.password)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("NOT_FOUND");
                done();
            });
    });
    it(`🎲 Delete the first game created (DELETE /games/:id)`, done => {
        chai.request(server)
            .delete(`/games/${firstGame._id}`)
            .auth(Config.app.basicAuth.username, Config.app.basicAuth.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const game = res.body;
                expect(game._id).to.equal(firstGame._id);
                done();
            });
    });
    it(`🎲 Can't delete the first game twice (DELETE /games/:id)`, done => {
        chai.request(server)
            .delete(`/games/${firstGame._id}`)
            .auth(Config.app.basicAuth.username, Config.app.basicAuth.password)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("NOT_FOUND");
                done();
            });
    });
});