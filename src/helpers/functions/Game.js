const { gameStatuses, gameSortByFields, gameDefaultOptions } = require("../constants/Game");

exports.getGameStatuses = () => JSON.parse(JSON.stringify(gameStatuses));

exports.getGameSortByFields = () => JSON.parse(JSON.stringify(gameSortByFields));

exports.getGameDefaultOptions = () => JSON.parse(JSON.stringify(gameDefaultOptions));

exports.getGameCardById = (game, cardId) => game.cards.find(({ _id }) => _id.toString() === cardId.toString());