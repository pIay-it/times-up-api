const { flatten } = require("mongo-dot-notation");
const Card = require("../db/models/Card");
const { checkRequestData } = require("../helpers/functions/Express");
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
    const sameLabelCard = await this.findOne({ label: { $regex: new RegExp(data.label, "iu") } });
    if (sameLabelCard) {
        throw generateError("CARD_ALREADY_EXISTS", `There is already an existing card with label "${data.label}".`);
    }
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

exports.checkAndFillDataBeforeUpdate = async(data, existingCard) => {
    if (!existingCard) {
        throw generateError("NOT_FOUND", `Card not found.`);
    }
    if (data.label) {
        const sameLabelCard = await this.findOne({ _id: { $ne: existingCard._id }, label: { $regex: new RegExp(data.label, "iu") } });
        if (sameLabelCard) {
            throw generateError("CARD_ALREADY_EXISTS", `There is already an existing card with label "${data.label}".`);
        }
    }
    if (data.categories) {
        this.fillCategories(data);
    }
};

exports.findOneAndUpdate = async(search, data, options = {}) => {
    const { toJSON } = options;
    delete options.toJSON;
    options.new = options.new === undefined ? true : options.new;
    const existingCard = await this.findOne(search);
    await this.checkAndFillDataBeforeUpdate(data, existingCard);
    const updatedCard = await Card.findOneAndUpdate(search, flatten(data), options);
    return toJSON ? updatedCard.toJSON() : updatedCard;
};

exports.findOneAndDelete = async search => {
    const card = await this.findOne(search);
    if (!card) {
        throw generateError("NOT_FOUND", `Card not found.`);
    }
    await Card.deleteOne(search);
    return card;
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

exports.patchCard = async(req, res) => {
    try {
        const { body, params } = checkRequestData(req);
        const card = await this.findOneAndUpdate({ _id: params.id }, body);
        return res.status(200).json(card);
    } catch (e) {
        sendError(res, e);
    }
};

exports.deleteCard = async(req, res) => {
    try {
        const { params } = checkRequestData(req);
        const card = await this.findOneAndDelete({ _id: params.id });
        return res.status(200).json(card);
    } catch (e) {
        sendError(res, e);
    }
};