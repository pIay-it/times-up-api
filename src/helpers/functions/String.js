const XSS = require("xss");

exports.toTitleCase = str => str.toString().toLowerCase().replace(/^\w|\s\w|[-_]\w/gu, m => m.toUpperCase());

exports.removeMultipleSpacesToSingle = str => str.replace(/\s\s+/gu, " ");

// eslint-disable-next-line new-cap
exports.filterOutHTMLTags = str => XSS(str, { whiteList: [], stripIgnoreTag: true });