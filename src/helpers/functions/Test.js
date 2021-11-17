const mongoose = require("mongoose");
const { it } = require("mocha");
const chai = require("chai");
const { getDummyCards } = require("./Card");
const Config = require("../../../config");
const app = require("../../../app");

exports.resetDatabase = done => {
    Promise.all(mongoose.connection.modelNames().map(model => mongoose.model(model).deleteMany())).then(() => done());
};

exports.createDummyCards = () => {
    it(`🃏 Creates dummy cards (POST /cards)`, done => {
        const server = app.listen(9999);
        const requests = [];
        const cards = getDummyCards();
        for (const card of cards) {
            requests.push(chai.request(server).post("/cards").auth(Config.app.basicAuth.username, Config.app.basicAuth.password).send(card));
        }
        Promise.all(requests).then(() => done());
    });
};