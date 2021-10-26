const { describe, it, before, after } = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../../../app");
const { resetDatabase } = require("../../../src/helpers/functions/Test");

chai.use(chaiHttp);
const { expect } = chai;

let server, doudouCard, catCard, peterPanCard, pacManCard;

describe("A - Card CRUD [Create / Read / Update / Delete]", () => {
    before(done => resetDatabase(done));
    before(done => {
        server = app.listen(3000, done);
    });
    after(done => resetDatabase(done));
    it("🔖 Can't create a card without any category (POST /cards)", done => {
        chai.request(server)
            .post("/cards")
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
            .send({ label: "Doudou ", categories: [" personality"], difficulty: 2 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                doudouCard = res.body;
                expect(doudouCard.label).to.equal("Doudou");
                expect(doudouCard.categories).to.be.an("array");
                expect(doudouCard.categories.length).to.equal(1);
                expect(doudouCard.categories[0]).to.equal("personality");
                expect(doudouCard.difficulty).to.equal(2);
                done();
            });
    });
    it(`🃏 Can't create a second card labeled "Doudou" (POST /cards)`, done => {
        chai.request(server)
            .post("/cards")
            .send({ label: " douDou ", categories: [" personality"], difficulty: 2 })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("CARD_ALREADY_EXISTS");
                done();
            });
    });
    it(`🃏 Can't create a card with a label only with HTML tags (POST /cards)`, done => {
        chai.request(server)
            .post("/cards")
            .send({ label: " <h3></h3> ", categories: [" personality"], difficulty: 2 })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("BAD_REQUEST");
                done();
            });
    });
    it(`🃏 Creates a card "Cat" with "animal" category and 1 difficulty ("nature" category should be implicitly added) (POST /cards)`, done => {
        chai.request(server)
            .post("/cards")
            .send({ label: "        cat ", categories: [" animal"], difficulty: 1 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                catCard = res.body;
                expect(catCard.label).to.equal("Cat");
                expect(catCard.categories).to.be.an("array");
                expect(catCard.categories.length).to.equal(2);
                expect(catCard.categories[0]).to.equal("animal");
                expect(catCard.categories[1]).to.equal("nature");
                expect(catCard.difficulty).to.equal(1);
                done();
            });
    });
    it(`🃏 Creates a card "Peter Pan" with "book" and "movie" categories and 1 difficulty ("art" category should be implicitly added) (POST /cards)`, done => {
        chai.request(server)
            .post("/cards")
            .send({ label: "        PETER PAN   ", categories: [" book", "movie "], difficulty: 1 })
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
    it(`🃏 Can't get an unknown card (GET /cards/:id)`, done => {
        chai.request(server)
            // eslint-disable-next-line new-cap
            .get(`/cards/${mongoose.Types.ObjectId()}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("NOT_FOUND");
                done();
            });
    });
    it(`🃏 Update the Pac-Man card (PATCH /cards/:id)`, done => {
        chai.request(server)
            .patch(`/cards/${pacManCard._id}`)
            .send({ label: "pac-man", categories: ["video-game", "character"], difficulty: 3 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                pacManCard = res.body;
                expect(pacManCard.difficulty).to.equal(3);
                expect(pacManCard.categories).to.be.an("array");
                expect(pacManCard.categories.length).to.equal(3);
                expect(pacManCard.categories[0]).to.equal("video-game");
                expect(pacManCard.categories[1]).to.equal("character");
                expect(pacManCard.categories[2]).to.equal("art");
                done();
            });
    });
    it(`🃏 Can't update a card with an already existing label (PATCH /cards/:id)`, done => {
        chai.request(server)
            .patch(`/cards/${pacManCard._id}`)
            .send({ label: "doudou", difficulty: 1 })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.type).to.equal("CARD_ALREADY_EXISTS");
                done();
            });
    });
    it(`🃏 Can't update a card with an unknown ID (PATCH /cards/:id)`, done => {
        chai.request(server)
            // eslint-disable-next-line new-cap
            .patch(`/cards/${mongoose.Types.ObjectId()}`)
            .send({ label: "doudou", difficulty: 1 })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.type).to.equal("NOT_FOUND");
                done();
            });
    });
});