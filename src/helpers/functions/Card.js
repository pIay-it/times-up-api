const { cardCategories, cardStatuses, cardPlayableStatuses, cardSortByFields, dummyCards } = require("../constants/Card");

exports.getCardCategories = () => JSON.parse(JSON.stringify(cardCategories));

exports.getCardStatuses = () => JSON.parse(JSON.stringify(cardStatuses));

exports.getCardPlayableStatuses = () => JSON.parse(JSON.stringify(cardPlayableStatuses));

exports.getCardSortByFields = () => JSON.parse(JSON.stringify(cardSortByFields));

exports.getDummyCards = () => JSON.parse(JSON.stringify(dummyCards));