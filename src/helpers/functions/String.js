const XSS = require("xss");

exports.toTitleCase = str => {
    const wordLetter = "[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]";
    const firstLetterRegexp = new RegExp(`^${wordLetter}|\\s${wordLetter}|[-_]${wordLetter}`, "gu");
    return str.toString().toLowerCase().replace(firstLetterRegexp, m => m.toUpperCase());
};

exports.removeMultipleSpacesToSingle = str => str.replace(/\s\s+/gu, " ");

// eslint-disable-next-line new-cap
exports.filterOutHTMLTags = str => XSS(str, { whiteList: [], stripIgnoreTag: true });