require("dotenv").config();
const { bold } = require("colors");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const Config = require("./config");
const { sendError, generateError } = require("./src/helpers/functions/Error");
const { connect: connectToDatabase } = require("./src/helpers/functions/Mongoose");
const routes = require("./src/routes");

if (Config.sentry.enabled) {
    const Sentry = require("@sentry/node");
    const Tracing = require("@sentry/tracing");
    Sentry.init({
        dsn: `https://${Config.sentry.key}@o1048234.ingest.sentry.io/${Config.sentry.projectID}`,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Tracing.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
    });
}
console.log("Starting the application...");
connectToDatabase().then(() => {
    if (Config.app.nodeEnv !== "test") {
        console.log("✅ Connected to database.");
    }
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors({ origin: "*" }));
    app.use(express.static("public"));
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError) {
            sendError(res, generateError("BAD_REQUEST", "Couldn't parse JSON."));
        } else {
            next();
        }
    });
    routes(app);
    app.listen(Config.app.port);
    if (Config.app.nodeEnv !== "test") {
        console.log(`${bold("⏳ Time's UP API by Play-IT")} started on port ${bold.blue(Config.app.port)} and running on database ${bold.green(Config.db.name)}.`);
        console.log(`${bold("📚 API Documentation:")} http://localhost:${Config.app.port}/apidoc`);
    }
    app.emit("ready");
});

module.exports = app;