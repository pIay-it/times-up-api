const { describe, it, before, after } = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../../../app");
const { resetDatabase } = require("../../../src/helpers/functions/Test");
const Config = require("../../../config");
const { expect } = chai;
let server, doudouCard, epervierCard, peterPanCard, pacManCard;

chai.use(chaiHttp);
describe("A - Card CRUD [Create / Read / Update / Delete]", () => {
    before(done => resetDatabase(done));
    before(done => {
        server = app.listen(3000, done);
    });
    after(done => resetDatabase(done));
    it(`🔒 Can't create a card without basic authentication credentials (POST /cards)`, done => {
        chai.request(server)
            .post("/cards")
            .send({ label: "Doudou ", categories: [" personality"], difficulty: 2 })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("UNAUTHORIZED");
                done();
            });
    });
    it("🔖 Can't create a card without any category (POST /cards)", done => {
        chai.request(server)
            .post("/cards")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ label: "Doudou", categories: [], difficulty: 2 })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("BAD_REQUEST");
                done();
            });
    });
    it(`🃏 Creates a card "Doudou" with "personality" category and 2 difficulty (POST /cards)`, done => {
        chai.request(server)
            .post("/cards")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ label: "Doudou ", categories: [" personality"], difficulty: 2, description: "   ", imageURL: "      " })
            .end((err, res) => {
                expect(res).to.have.status(200);
                doudouCard = res.body;
                expect(doudouCard.label).to.equal("Doudou");
                expect(doudouCard.categories).to.be.an("array");
                expect(doudouCard.categories.length).to.equal(1);
                expect(doudouCard.categories[0]).to.equal("personality");
                expect(doudouCard.difficulty).to.equal(2);
                expect(doudouCard.description).to.not.exist;
                expect(doudouCard.imageURL).to.not.exist;
                done();
            });
    });
    it(`🃏 Can't create a card with a label only with HTML tags (POST /cards)`, done => {
        chai.request(server)
            .post("/cards")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ label: " <h3></h3> ", categories: [" personality"], difficulty: 2 })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("BAD_REQUEST");
                done();
            });
    });
    it(`🃏 Creates a card "Épervier" with "animal" category and 1 difficulty ("nature" category should be implicitly added) (POST /cards)`, done => {
        chai.request(server)
            .post("/cards")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ label: "        épervier ", categories: [" animal"], difficulty: 1 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                epervierCard = res.body;
                expect(epervierCard.label).to.equal("Épervier");
                expect(epervierCard.categories).to.be.an("array");
                expect(epervierCard.categories.length).to.equal(2);
                expect(epervierCard.categories[0]).to.equal("animal");
                expect(epervierCard.categories[1]).to.equal("nature");
                expect(epervierCard.difficulty).to.equal(1);
                done();
            });
    });
    it(`🃏 Creates a card "Peter Pan" with "book" and "movie" categories and 1 difficulty ("art" category should be implicitly added) (POST /cards)`, done => {
        chai.request(server)
            .post("/cards")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ label: "        PETER           PAN   ", categories: [" book", "movie "], difficulty: 1 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                peterPanCard = res.body;
                expect(peterPanCard.label).to.equal("Peter Pan");
                expect(peterPanCard.categories).to.be.an("array");
                expect(peterPanCard.categories.length).to.equal(3);
                expect(peterPanCard.categories[0]).to.equal("book");
                expect(peterPanCard.categories[1]).to.equal("movie");
                expect(peterPanCard.categories[2]).to.equal("art");
                expect(peterPanCard.difficulty).to.equal(1);
                done();
            });
    });
    it(`🃏 Creates a card "Pac-Man" with "video-game" and "art" categories and 1 difficulty (HTML tags are filtered out for label and description) (POST /cards)`, done => {
        chai.request(server)
            .post("/cards")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ label: "<h1>pac-man</h1>", categories: ["video-game", "art"], difficulty: 1, description: "<em>   Waka waka         </em>", imageURL: "   https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pacman.svg/1200px-Pacman.svg.png" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                pacManCard = res.body;
                expect(pacManCard.label).to.equal("Pac-Man");
                expect(pacManCard.categories).to.be.an("array");
                expect(pacManCard.categories.length).to.equal(2);
                expect(pacManCard.categories[0]).to.equal("video-game");
                expect(pacManCard.categories[1]).to.equal("art");
                expect(pacManCard.difficulty).to.equal(1);
                expect(pacManCard.description).to.equal("Waka waka");
                expect(pacManCard.imageURL).to.equal("https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pacman.svg/1200px-Pacman.svg.png");
                done();
            });
    });
    it(`🃏 Get all available cards (GET /cards)`, done => {
        chai.request(server)
            .get("/cards")
            .end((err, res) => {
                expect(res).to.have.status(200);
                const cards = res.body;
                expect(cards).to.be.an("array");
                expect(cards.length).to.equal(4);
                expect(cards[0]._id).to.equal(doudouCard._id);
                expect(cards[3]._id).to.equal(pacManCard._id);
                expect(cards[0].label).to.equal(doudouCard.label);
                expect(cards[3].label).to.equal(pacManCard.label);
                expect(cards[0].createdAt).to.equal(doudouCard.createdAt);
                expect(cards[3].createdAt).to.equal(pacManCard.createdAt);
                done();
            });
    });
    it(`🃏 Get only two cards (GET /cards?limit=2)`, done => {
        chai.request(server)
            .get("/cards?limit=2")
            .end((err, res) => {
                expect(res).to.have.status(200);
                const cards = res.body;
                expect(cards).to.be.an("array");
                expect(cards.length).to.equal(2);
                done();
            });
    });
    it(`🃏 Get all available cards only with "createdAt" and "label" fields (GET /cards?fields=createdAt,label)`, done => {
        chai.request(server)
            .get("/cards?fields=createdAt,label")
            .end((err, res) => {
                expect(res).to.have.status(200);
                const cards = res.body;
                expect(cards).to.be.an("array");
                expect(cards.every(card => card._id && card.label && card.createdAt && !card.categories && !card.difficulty && !card.updatedAt)).to.be.true;
                done();
            });
    });
    it(`🃏 Get cards with "an" in the label (GET /cards?label=AN)`, done => {
        chai.request(server)
            .get("/cards?label=AN")
            .end((err, res) => {
                expect(res).to.have.status(200);
                const cards = res.body;
                expect(cards).to.be.an("array");
                expect(cards.length).to.equal(2);
                expect(cards.every(({ label }) => label.match(new RegExp(/an/u, "ui")))).to.be.true;
                done();
            });
    });
    it(`🃏 Get cards with the art category (GET /cards?categories=art)`, done => {
        chai.request(server)
            .get("/cards?categories=art")
            .end((err, res) => {
                expect(res).to.have.status(200);
                const cards = res.body;
                expect(cards).to.be.an("array");
                expect(cards.length).to.equal(2);
                expect(cards.every(({ categories }) => categories.includes("art"))).to.be.true;
                done();
            });
    });
    it(`🃏 Get cards with the art and video-game categories (GET /cards?categories=art,video-game)`, done => {
        chai.request(server)
            .get("/cards?categories=art,video-game")
            .end((err, res) => {
                expect(res).to.have.status(200);
                const cards = res.body;
                expect(cards).to.be.an("array");
                expect(cards.length).to.equal(1);
                expect(cards.every(({ categories }) => categories.includes("art") && categories.includes("video-game"))).to.be.true;
                done();
            });
    });
    it(`🃏 Get cards with the art or video-game categories (GET /cards?categories=art|video-game)`, done => {
        chai.request(server)
            .get("/cards?categories=art|video-game")
            .end((err, res) => {
                expect(res).to.have.status(200);
                const cards = res.body;
                expect(cards).to.be.an("array");
                expect(cards.length).to.equal(2);
                expect(cards.every(({ categories }) => categories.includes("art") || categories.includes("video-game"))).to.be.true;
                done();
            });
    });
    it(`🃏 Get cards with the difficulty of 2 (GET /cards?difficulty=2)`, done => {
        chai.request(server)
            .get("/cards?difficulty=2")
            .end((err, res) => {
                expect(res).to.have.status(200);
                const cards = res.body;
                expect(cards).to.be.an("array");
                expect(cards.length).to.equal(1);
                expect(cards.every(({ difficulty }) => difficulty === 2)).to.be.true;
                done();
            });
    });
    it(`🃏 Get cards sorted in descending creation date (GET /cards?sort-by=createdAt&order=desc)`, done => {
        chai.request(server)
            .get("/cards?sort-by=createdAt&order=desc")
            .end((err, res) => {
                expect(res).to.have.status(200);
                const cards = res.body;
                expect(cards).to.be.an("array");
                expect(cards[0]._id).to.equal(pacManCard._id);
                done();
            });
    });
    it(`❓  Can't get an unknown card (GET /cards/:id)`, done => {
        chai.request(server)
            // eslint-disable-next-line new-cap
            .get(`/cards/${mongoose.Types.ObjectId()}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("CARD_NOT_FOUND");
                done();
            });
    });
    it(`🃏 Get the Pac-Man card (GET /cards/:id)`, done => {
        chai.request(server)
            .get(`/cards/${pacManCard._id}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card._id).to.be.equal(pacManCard._id);
                expect(card.label).to.equal(pacManCard.label);
                done();
            });
    });
    it(`🔒 Can't update a card without basic authentication credentials (PATCH /cards/:id)`, done => {
        chai.request(server)
            .patch(`/cards/${pacManCard._id}`)
            .send({ label: "pac-man", categories: ["video-game", "character"], difficulty: 3 })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("UNAUTHORIZED");
                done();
            });
    });
    it(`🃏 Update the Pac-Man card (PATCH /cards/:id)`, done => {
        chai.request(server)
            .patch(`/cards/${pacManCard._id}`)
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ label: "pac-man", categories: ["video-game", "character"], difficulty: 3, description: "    ", imageURL: "" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                pacManCard = res.body;
                expect(pacManCard.difficulty).to.equal(3);
                expect(pacManCard.categories).to.be.an("array");
                expect(pacManCard.categories.length).to.equal(3);
                expect(pacManCard.categories[0]).to.equal("video-game");
                expect(pacManCard.categories[1]).to.equal("character");
                expect(pacManCard.categories[2]).to.equal("art");
                expect(pacManCard.description).to.equal("");
                expect(pacManCard.imageURL).to.equal("");
                done();
            });
    });
    it(`❓  Can't update a card with an unknown ID (PATCH /cards/:id)`, done => {
        chai.request(server)
            // eslint-disable-next-line new-cap
            .patch(`/cards/${mongoose.Types.ObjectId()}`)
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .send({ label: "doudou", difficulty: 1 })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("CARD_NOT_FOUND");
                done();
            });
    });
    it(`🔒 Can't delete a card without basic authentication credentials (DELETE /cards/:id)`, done => {
        chai.request(server)
            .delete(`/cards/${pacManCard._id}`)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.type).to.equal("UNAUTHORIZED");
                done();
            });
    });
    it(`❓  Can't delete an unknown card (DELETE /cards/:id)`, done => {
        chai.request(server)
            // eslint-disable-next-line new-cap
            .delete(`/cards/${mongoose.Types.ObjectId()}`)
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("CARD_NOT_FOUND");
                done();
            });
    });
    it(`🃏 Delete the Pac-Man card (DELETE /cards/:id)`, done => {
        chai.request(server)
            .delete(`/cards/${pacManCard._id}`)
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                const card = res.body;
                expect(card._id).to.be.equal(pacManCard._id);
                done();
            });
    });
    it(`🃏 Can't delete the Pac-Man card twice (DELETE /cards/:id)`, done => {
        chai.request(server)
            .delete(`/cards/${pacManCard._id}`)
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("CARD_NOT_FOUND");
                done();
            });
    });
});