const { validationResult, matchedData } = require("express-validator");
const Error = require("../../classes/Error");
const { queryStringOrderValues } = require("../constants/Express");

exports.checkRequestData = req => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error("BAD_REQUEST", errors.array());
    }
    return {
        body: matchedData(req, { locations: ["body"] }),
        query: matchedData(req, { locations: ["query"] }),
        params: matchedData(req, { locations: ["params"] }),
        cookies: matchedData(req, { locations: ["cookies"] }),
        headers: matchedData(req, { locations: ["headers"] }),
    };
};

exports.getQueryStringOrderValues = () => JSON.parse(JSON.stringify(queryStringOrderValues));

exports.getMongooseOrderValueFromQueryString = str => {
    const ascendingStrings = ["asc", "ascending"];
    return ascendingStrings.includes(str) ? 1 : -1;
};