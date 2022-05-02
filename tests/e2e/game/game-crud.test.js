const mongoose = require("mongoose");
const { decode: decodeJWT } = require("jsonwebtoken");
const { describe, it, before, after } = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");
const { getCardCategories } = require("../../../src/helpers/functions/Card");
const { resetDatabase, createDummyCards } = require("../../../src/helpers/functions/Test");
const Config = require("../../../config");
const { expect } = chai;
let server;
let basicFirstGame, basicSecondGame;
let firstAnonymousUserJWT, firstAnonymousUserJWTFirstGame, secondAnonymousUserJWT, secondAnonymousUserJWTFirstGame;
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
    it(`🔒 Can't create a game without any authentication (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .send({ players, status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("UNAUTHORIZED");
                done();
            });
    });
    it(`🤼 Can't create a game with twice the same player name (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ players: [...players, { name: " <h1>     Toto   </h1>     " }] })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("PLAYERS_NAME_NOT_UNIQUE");
                done();
            });
    });
    createDummyCards();
    it(`🎲 Creates a fast game with 4 players, default options and "playing" status to start with basic auth (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ players, status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                basicFirstGame = res.body;
                players = basicFirstGame.players;
                expect(basicFirstGame.players).to.be.an("array");
                expect(basicFirstGame.players.length).to.equal(4);
                expect(basicFirstGame.teams[0].name).to.equal("Jaune");
                expect(basicFirstGame.teams[0].color).to.equal("#FFE41D");
                expect(basicFirstGame.teams[1].name).to.equal("Bleue");
                expect(basicFirstGame.teams[1].color).to.equal("#07ABFF");
                expect(players[0].name).to.equal("Doudou");
                expect(players[0].team).to.equal("Bleue");
                expect(players[1].name).to.equal("Juju");
                expect(players[1].team).to.equal("Jaune");
                expect(players[2].name).to.equal("Toto");
                expect(players[2].team).to.equal("Bleue");
                expect(players[3].name).to.equal("Thom");
                expect(players[3].team).to.equal("Jaune");
                expect(basicFirstGame.cards).to.be.an("array");
                expect(basicFirstGame.cards.length).to.equal(40);
                expect([...new Set(basicFirstGame.cards.map(({ label }) => label))].length).to.equal(40);
                expect(basicFirstGame.cards.every(({ status }) => status === "to-guess")).to.be.true;
                expect(basicFirstGame.anonymousUser).to.not.exist;
                expect(basicFirstGame.status).to.equal("playing");
                expect(basicFirstGame.round).to.equal(1);
                expect(basicFirstGame.turn).to.equal(1);
                expect(basicFirstGame.speaker).to.deep.equal(players[0]);
                expect(basicFirstGame.guesser).to.not.exist;
                expect(basicFirstGame.queue).to.be.an("array");
                expect(basicFirstGame.queue.length).to.equal(2);
                expect(basicFirstGame.queue[0].team).to.equal("Jaune");
                expect(basicFirstGame.queue[0].players[0]._id).to.equal(players[1]._id);
                expect(basicFirstGame.queue[0].players[1]._id).to.equal(players[3]._id);
                expect(basicFirstGame.queue[1].team).to.equal("Bleue");
                expect(basicFirstGame.queue[1].players[0]._id).to.equal(players[2]._id);
                expect(basicFirstGame.queue[1].players[1]._id).to.equal(players[0]._id);
                expect(basicFirstGame.options.players.areTeamUp).to.be.true;
                expect(basicFirstGame.options.cards.count).to.equal(40);
                expect(basicFirstGame.options.cards.categories).to.deep.equal(getCardCategories());
                expect(basicFirstGame.options.cards.difficulties).to.deep.equal([1, 2, 3]);
                expect(basicFirstGame.options.cards.helpers.areDisplayed).to.be.true;
                expect(basicFirstGame.options.rounds.count).to.equal(3);
                expect(basicFirstGame.options.rounds.turns.timeLimit).to.equal(30);
                expect(basicFirstGame.history).to.not.exist;
                expect(basicFirstGame.summary).to.not.exist;
                done();
            });
    });
    it(`🎲 Creates another fast game with 5 players, default options and "preparing" status to start with basic auth (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ players: [...players, { name: "Nana" }] })
            .end((err, res) => {
                expect(res).to.have.status(200);
                basicSecondGame = res.body;
                players = basicSecondGame.players;
                expect(basicSecondGame.players).to.be.an("array");
                expect(basicSecondGame.players.length).to.equal(5);
                expect(players[0].name).to.equal("Doudou");
                expect(players[0].team).to.equal("Bleue");
                expect(players[1].name).to.equal("Juju");
                expect(players[1].team).to.equal("Jaune");
                expect(players[2].name).to.equal("Toto");
                expect(players[2].team).to.equal("Bleue");
                expect(players[3].name).to.equal("Thom");
                expect(players[3].team).to.equal("Jaune");
                expect(players[4].name).to.equal("Nana");
                expect(players[4].team).to.equal("Bleue");
                expect(basicSecondGame.cards).to.be.an("array");
                expect(basicSecondGame.anonymousUser).to.not.exist;
                expect(basicSecondGame.status).to.equal("preparing");
                expect(basicSecondGame.history).to.not.exist;
                done();
            });
    });
    it(`🥸 Registers first user anonymously (POST /anonymous-users)`, done => {
        chai.request(server)
            .post("/anonymous-users")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.token).to.exist;
                firstAnonymousUserJWT = res.body.token;
                done();
            });
    });
    it(`🎲 Creates a fast game with 4 players, default options and "playing" status to start with anonymous JWT (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .send({ players, status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                firstAnonymousUserJWTFirstGame = res.body;
                const decodedToken = decodeJWT(firstAnonymousUserJWT);
                expect(firstAnonymousUserJWTFirstGame.anonymousUser).to.deep.equal({ _id: decodedToken.userId });
                done();
            });
    });
    it(`🎲 Can't create a game with first anonymous JWT because user has already on-going game (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .send({ players, status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("USER_HAS_ON_GOING_GAMES");
                done();
            });
    });
    it(`🥸 Registers second user anonymously (POST /anonymous-users)`, done => {
        chai.request(server)
            .post("/anonymous-users")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.token).to.exist;
                secondAnonymousUserJWT = res.body.token;
                done();
            });
    });
    it(`🎲 Creates a fast game with 4 players, default options and "preparing" status to start with anonymous JWT (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .set({ Authorization: `Bearer ${secondAnonymousUserJWT}` })
            .send({ players })
            .end((err, res) => {
                expect(res).to.have.status(200);
                secondAnonymousUserJWTFirstGame = res.body;
                expect(secondAnonymousUserJWTFirstGame.status).to.equal("preparing");
                const decodedToken = decodeJWT(secondAnonymousUserJWT);
                expect(secondAnonymousUserJWTFirstGame.anonymousUser).to.deep.equal({ _id: decodedToken.userId });
                done();
            });
    });
    it(`🎲 Can't create a game with second anonymous JWT because user has already on-going game (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .set({ Authorization: `Bearer ${secondAnonymousUserJWT}` })
            .send({ players })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("USER_HAS_ON_GOING_GAMES");
                done();
            });
    });
    it(`🔒 Can't get all available games without any authentication (GET /games)`, done => {
        chai.request(server)
            .get("/games")
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("UNAUTHORIZED");
                done();
            });
    });
    it(`🎲 Gets all available games with basic auth (GET /games)`, done => {
        chai.request(server)
            .get("/games")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const games = res.body;
                expect(games).to.be.an("array");
                expect(games.length).to.equal(4);
                done();
            });
    });
    it(`🎲 Gets all games with status "preparing" with basic auth (GET /games?status=preparing)`, done => {
        chai.request(server)
            .get("/games?status=preparing")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const games = res.body;
                expect(games).to.be.an("array");
                expect(games.length).to.equal(2);
                expect(games.every(game => game.status === "preparing")).to.be.true;
                done();
            });
    });
    it(`🎲 Gets only one game with basic auth (GET /games?limit=1)`, done => {
        chai.request(server)
            .get("/games?limit=1")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const games = res.body;
                expect(games).to.be.an("array");
                expect(games.length).to.equal(1);
                expect(games[0]._id).to.equal(basicFirstGame._id);
                done();
            });
    });
    it(`🎲 Gets all available games sorted in descending creation date with basic auth (GET /games?sort-by=createdAt&order=desc)`, done => {
        chai.request(server)
            .get("/games?sort-by=createdAt&order=desc")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const games = res.body;
                expect(games).to.be.an("array");
                expect(games.length).to.equal(4);
                expect(games[0]._id).to.equal(secondAnonymousUserJWTFirstGame._id);
                done();
            });
    });
    it(`🎲 Gets all available games with "players" field only with basic auth (GET /games?fields=players)`, done => {
        chai.request(server)
            .get("/games?fields=players")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const games = res.body;
                expect(games).to.be.an("array");
                expect(games.length).to.equal(4);
                expect(games.every(game => game.players && !game.cards && !game.options && !game.createdAt && !game.updatedAt)).to.be.true;
                done();
            });
    });
    it(`🎲 Gets games from first anonymous user with JWT auth (GET /games)`, done => {
        chai.request(server)
            .get("/games")
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const games = res.body;
                const decodedToken = decodeJWT(firstAnonymousUserJWT);
                expect(games).to.be.an("array");
                expect(games.length).to.equal(1);
                expect(games.every(game => game.anonymousUser._id === decodedToken.userId)).to.be.true;
                done();
            });
    });
    it(`❓  Can't get an unknown game (GET /game/:id)`, done => {
        chai.request(server)
            // eslint-disable-next-line new-cap
            .get(`/games/${mongoose.Types.ObjectId()}`)
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("GAME_NOT_FOUND");
                done();
            });
    });
    it(`🔒 Can't get a game without any authentication (GET /games/:id)`, done => {
        chai.request(server)
            .get(`/games/${basicFirstGame._id}`)
            .send({ status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("UNAUTHORIZED");
                done();
            });
    });
    it(`🎲 Gets the first game created with basic auth (GET /games/:id)`, done => {
        chai.request(server)
            .get(`/games/${basicFirstGame._id}`)
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const game = res.body;
                expect(game._id).to.be.equal(basicFirstGame._id);
                done();
            });
    });
    it(`🔒 Can't get a game if it doesn't belong to user attached to JWT, game was created by another user (GET /games/:id)`, done => {
        chai.request(server)
            .get(`/games/${secondAnonymousUserJWTFirstGame._id}`)
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .send({ status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("GAME_DOESNT_BELONG_TO_USER");
                done();
            });
    });
    it(`🔒 Can't get a game if it doesn't belong to user attached to JWT, game was created by basic auth (GET /games/:id)`, done => {
        chai.request(server)
            .get(`/games/${basicFirstGame._id}`)
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .send({ status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("GAME_DOESNT_BELONG_TO_USER");
                done();
            });
    });
    it(`🎲 Gets the first game created by first anonymous user with JWT auth (GET /games/:id)`, done => {
        chai.request(server)
            .get(`/games/${firstAnonymousUserJWTFirstGame._id}`)
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .send({ status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
    it(`🔒 Can't update a game without any authentication (PATCH /games/:id)`, done => {
        chai.request(server)
            .patch(`/games/${basicFirstGame._id}`)
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
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("GAME_NOT_FOUND");
                done();
            });
    });
    it(`🎲 Updates the first game created with basic auth (PATCH /games/:id)`, done => {
        chai.request(server)
            .patch(`/games/${basicFirstGame._id}`)
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const game = res.body;
                expect(game._id).to.equal(basicFirstGame._id);
                basicFirstGame = game;
                expect(basicFirstGame.status).to.equal("playing");
                done();
            });
    });
    it(`🔒 Can't get a game if it doesn't belong to user attached to JWT, game was created by another user (PATCH /games/:id)`, done => {
        chai.request(server)
            .patch(`/games/${secondAnonymousUserJWTFirstGame._id}`)
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .send({ status: "canceled" })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("GAME_DOESNT_BELONG_TO_USER");
                done();
            });
    });
    it(`🔒 Can't get a game if it doesn't belong to user attached to JWT, game was created by basic auth (PATCH /games/:id)`, done => {
        chai.request(server)
            .patch(`/games/${basicFirstGame._id}`)
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .send({ status: "canceled" })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("GAME_DOESNT_BELONG_TO_USER");
                done();
            });
    });
    it(`🎲 Can't update the first game of first anonymous user for "done" status with JWT auth (PATCH /games/:id)`, done => {
        chai.request(server)
            .patch(`/games/${firstAnonymousUserJWTFirstGame._id}`)
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .send({ status: "over" })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("FORBIDDEN_NEW_GAME_STATUS");
                done();
            });
    });
    it(`🎲 Updates the first game of first anonymous user with JWT auth (PATCH /games/:id)`, done => {
        chai.request(server)
            .patch(`/games/${firstAnonymousUserJWTFirstGame._id}`)
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .send({ status: "canceled" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const game = res.body;
                expect(game.status).to.equal("canceled");
                done();
            });
    });
    it(`🎲 Gets all games with status "preparing" with basic auth (GET /games?status=playing,canceled)`, done => {
        chai.request(server)
            .get("/games?status=playing,canceled")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const games = res.body;
                const expectedGameStatuses = ["playing", "canceled"];
                expect(games).to.be.an("array");
                expect(games.length).to.equal(2);
                expect(games.every(game => expectedGameStatuses.includes(game.status))).to.be.true;
                done();
            });
    });
    it(`🎲 Gets all games created by first anonymous user with basic auth (GET /games?anonymous-user-id=userId)`, done => {
        const decodedJWT = decodeJWT(firstAnonymousUserJWT);
        chai.request(server)
            .get(`/games?anonymous-user-id=${decodedJWT.userId}`)
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const games = res.body;
                expect(games).to.be.an("array");
                expect(games.length).to.equal(1);
                expect(games.every(game => game.anonymousUser._id === decodedJWT.userId)).to.be.true;
                done();
            });
    });
    it(`🔒 Can't get all games created by first anonymous user with JWT auth (GET /games?anonymous-user-id=userId)`, done => {
        const decodedJWT = decodeJWT(firstAnonymousUserJWT);
        chai.request(server)
            .get(`/games?anonymous-user-id=${decodedJWT.userId}`)
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("BAD_REQUEST");
                done();
            });
    });
    it(`🎲 Can't update the first game of first anonymous user with JWT auth because it's canceled (PATCH /games/:id)`, done => {
        chai.request(server)
            .patch(`/games/${firstAnonymousUserJWTFirstGame._id}`)
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .send({ status: "canceled" })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("GAME_NOT_UPDATABLE");
                done();
            });
    });
    it(`🎲 Creates another game for first anonymous user with JWT auth (POST /games)`, done => {
        chai.request(server)
            .post("/games")
            .set({ Authorization: `Bearer ${firstAnonymousUserJWT}` })
            .send({ players, status: "playing" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
    it(`🔒 Can't delete a game without basic authentication (DELETE /games/:id)`, done => {
        chai.request(server)
            .delete(`/games/${basicFirstGame._id}`)
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
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("GAME_NOT_FOUND");
                done();
            });
    });
    it(`🎲 Delete the first game created (DELETE /games/:id)`, done => {
        chai.request(server)
            .delete(`/games/${basicFirstGame._id}`)
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const game = res.body;
                expect(game._id).to.equal(basicFirstGame._id);
                done();
            });
    });
    it(`🎲 Can't delete the first game twice (DELETE /games/:id)`, done => {
        chai.request(server)
            .delete(`/games/${basicFirstGame._id}`)
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("GAME_NOT_FOUND");
                done();
            });
    });
});