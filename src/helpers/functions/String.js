const XSS = require("xss");

exports.toTitleCase = str => str.toString().toLowerCase().replace(/^\w|\s\w|[-_]\w/gu, m => m.toUpperCase());

// eslint-disable-next-line new-cap
exports.filterOutHTMLTags = str => XSS(str, { whiteList: [], stripIgnoreTag: true });