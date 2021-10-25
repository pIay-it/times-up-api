const { cardCategories } = require("../constants/Card");

exports.getCardCategories = JSON.parse(JSON.stringify(cardCategories));