const { describe } = require("mocha");

describe("E2E - 🎲 Game tests", () => {
    require("./game-crud.test");
    require("./classic-game.test");
});