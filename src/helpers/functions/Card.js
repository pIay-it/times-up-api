const { cardCategories, cardStatuses } = require("../constants/Card");

exports.getCardCategories = () => JSON.parse(JSON.stringify(cardCategories));

exports.getCardStatuses = () => JSON.parse(JSON.stringify(cardStatuses));