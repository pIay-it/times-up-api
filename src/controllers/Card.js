const Card = require("../db/models/Card");
const { checkRequestData } = require("../helpers/functions/Express");
const { toTitleCase } = require("../helpers/functions/String");
const { sendError, generateError } = require("../helpers/functions/Error");

exports.find = (search, projection, options = {}) => Card.find(search, projection, options);

exports.findOne = (search, projection, options = {}) => Card.findOne(search, projection, options);

exports.fillCategories = data => {
    const subCategoriesMetadata = {
        "technology": { mainCategory: "object" },
        "clothes": { mainCategory: "object" },
        "movie": { mainCategory: "art" },
        "tv-series": { mainCategory: "art" },
        "video-game": { mainCategory: "art" },
        "painting": { mainCategory: "art" },
        "theatre-play": { mainCategory: "art" },
        "sculpture": { mainCategory: "art" },
        "architecture": { mainCategory: "art" },
        "music": { mainCategory: "art" },
        "animal": { mainCategory: "nature" },
        "sport": { mainCategory: "activity" },
        "job": { mainCategory: "activity" },
    };
    data.categories = data.categories.reduce((acc, category) => {
        const subCategoryMetadata = subCategoriesMetadata[category];
        if (subCategoryMetadata && !acc.includes(subCategoryMetadata.mainCategory)) {
            acc.push(subCategoryMetadata.mainCategory);
        }
        return acc;
    }, data.categories);
};

exports.checkAndFillDataBeforeCreate = async data => {
    const existingCard = await this.findOne({ label: { $regex: new RegExp(data.label, "iu") } });
    if (existingCard) {
        throw generateError("CARD_ALREADY_EXISTS", `There is already an existing card with label "${data.label}".`);
    }
    data.label = toTitleCase(data.label);
    this.fillCategories(data);
};

exports.create = async(data, options = {}) => {
    await this.checkAndFillDataBeforeCreate(data);
    const { toJSON } = options;
    delete options.toJSON;
    if (!Array.isArray(data)) {
        options = null;
    }
    const card = await Card.create(data, options);
    return toJSON ? card.toJSON() : card;
};

exports.getCards = async(req, res) => {
    try {
        const cards = await this.find();
        return res.status(200).json(cards);
    } catch (e) {
        sendError(res, e);
    }
};

exports.getCard = async(req, res) => {
    try {
        const { params } = checkRequestData(req);
        const card = await this.findOne({ _id: params.id });
        if (!card) {
            throw generateError("NOT_FOUND", `Card not found with ID "${params.id}".`);
        }
        return res.status(200).json(card);
    } catch (e) {
        sendError(res, e);
    }
};

exports.postCard = async(req, res) => {
    try {
        const { body } = checkRequestData(req);
        const card = await this.create(body);
        return res.status(200).json(card);
    } catch (e) {
        sendError(res, e);
    }
};