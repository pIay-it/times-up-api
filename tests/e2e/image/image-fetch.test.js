const { before, describe, it } = require("mocha");
const chai = require("chai");
const app = require("../../../app");
const Config = require("../../../config");
const { expect } = chai;
let server;

describe("A - Image fetch", () => {
    before(done => {
        server = app.listen(3000, done);
    });
    it(`🖼️ Fetch images with "Chat" search (GET /images?search=Chat)`, done => {
        chai.request(server)
            .get("/images?search=Chat")
            .auth(Config.app.routes.auth.basic.username, Config.app.routes.auth.basic.password)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                done();
            }).timeout(5000);
    });
});