require("dotenv").config();

const Config = {
    app: {
        nodeEnv: process.env.NODE_ENV || "production",
        port: process.env.PORT || 4242,
        basicAuth: {
            username: process.env.BASIC_AUTH_USERNAME || "root",
            password: process.env.BASIC_AUTH_PASSWORD || "secret",
        },
    },
    db: {
        name: process.env.DB_NAME || "times-up",
        auth: {
            user: process.env.DB_USER,
            pass: process.env.DB_PASSWORD,
        },
    },
    sentry: {
        enabled: process.env.SENTRY_ENABLED === "true",
        projectID: process.env.SENTRY_PROJECT_ID,
        key: process.env.SENTRY_KEY,
    },
};

if (Config.app.nodeEnv === "test") {
    Config.db.name += "-test";
}

module.exports = Config;