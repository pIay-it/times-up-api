const Error = require("../../classes/Error");

exports.generateError = (errorType, data) => new Error(errorType, data);

exports.sendError = (res, e) => {
    if (e && res.headersSent) {
        // eslint-disable-next-line no-console
        console.log(e);
    } else if (e && e.response && e.response.data && e.response.data.HTTPCode) {
        res.status(e.response.data.HTTPCode).json(this.generateError(e.response.data.type, e.response.data.error || e.response.data.errors));
    } else if (e && e instanceof Error) {
        res.status(e.HTTPCode).json(e);
    } else if (e) {
        res.status(500).json(this.generateError("INTERNAL_SERVER_ERROR", e.toString()));
    }
};