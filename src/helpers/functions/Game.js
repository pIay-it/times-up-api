const { gameStatuses, gameDefaultOptions } = require("../constants/Game");

exports.getGameStatuses = JSON.parse(JSON.stringify(gameStatuses));

exports.getGameDefaultOptions = JSON.parse(JSON.stringify(gameDefaultOptions));