const { gameStatuses, gameDefaultOptions } = require("../constants/Game");

exports.getGameStatuses = () => JSON.parse(JSON.stringify(gameStatuses));

exports.getGameDefaultOptions = () => JSON.parse(JSON.stringify(gameDefaultOptions));

exports.getGameCardById = (game, cardId) => game.cards.find(({ _id }) => _id.toString() === cardId.toString());