const { cardCategories, cardStatuses, dummyCards } = require("../constants/Card");

exports.getCardCategories = () => JSON.parse(JSON.stringify(cardCategories));

exports.getCardStatuses = () => JSON.parse(JSON.stringify(cardStatuses));

exports.getDummyCards = () => JSON.parse(JSON.stringify(dummyCards));