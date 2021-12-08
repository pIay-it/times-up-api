const { after, before, describe, it } = require("mocha");
const chai = require("chai");
const app = require("../../../app");
const { resetDatabase } = require("../../../src/helpers/functions/Test");
const { decode: decodeJWT } = require("jsonwebtoken");
const { expect } = chai;
let server;

describe("A - User registration", () => {
    before(done => resetDatabase(done));
    before(done => {
        server = app.listen(3000, done);
    });
    after(done => resetDatabase(done));
    it(`🥸 Registers anonymously (POST /anonymous-users)`, done => {
        chai.request(server)
            .post("/anonymous-users")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.token).to.exist;
                const decodedToken = decodeJWT(res.body.token);
                expect(decodedToken.mode).to.equal("anonymous");
                expect(decodedToken.userId).to.exist;
                expect(decodedToken.userId.match(/^anonymous-[a-z0-9]{16}$/u)).to.be.an("array");
                expect(decodedToken.iat).to.exist;
                expect(decodedToken.exp).to.not.exist;
                done();
            });
    });
});