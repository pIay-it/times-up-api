const { cardCategories } = require("./Card");

exports.gameDefaultOptionsgameStatuses = ["preparing", "playing", "done", "canceled"];

exports.gameDefaultOptions = {
    players: { areTeamUp: true },
    cards: {
        count: 40,
        categories: cardCategories,
        difficulties: [1, 2, 3],
        helpers: { areDisplayed: true },
    },
    rounds: {
        count: 3,
        turns: { timeLimit: 30 },
    },
};