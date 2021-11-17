exports.deleteProperties = (obj, properties) => {
    if (!obj) {
        return;
    }
    for (const property of properties) {
        if (obj[property] !== undefined) {
            delete obj[property];
        }
    }
};