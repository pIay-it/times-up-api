const { describe, it, before, after } = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");
const { resetDatabase } = require("../../../src/helpers/functions/Test");

chai.use(chaiHttp);
const { expect } = chai;

let server, doudouCard, catCard, peterPanCard;

describe("A - Card creations", () => {
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
});