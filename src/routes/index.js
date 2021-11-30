const fs = require("fs");

module.exports = app => {
    fs.readdirSync(__dirname).forEach(file => {
        if (file === "index.js") {
            /**
             *
             *
             * @apiDefine Basic Basic authentication with username and password.
             *
             * @api {GET} / A] Get API info
             * @apiName GetAPIInfo
             * @apiGroup API 🔌
             *
             * @apiSuccess {String} name API's name
             * @apiSuccess {String} version API's version
             */
            app.route("/").get((req, res) => {
                res.status(200).json({ name: "⏳ Time's Up API by Play-IT", version: "0.1.1" });
            });
            return;
        }
        const name = file.substr(0, file.indexOf("."));
        require(`./${name}`)(app);
    });
};