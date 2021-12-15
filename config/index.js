require("dotenv").config();

const Config = {
    app: {
        nodeEnv: process.env.NODE_ENV || "production",
        port: process.env.PORT || 4242,
        routes: {
            auth: {
                basic: {
                    username: process.env.BASIC_AUTH_USERNAME || "root",
                    password: process.env.BASIC_AUTH_PASSWORD || "secret",
                },
                JWT: { privateKey: process.env.JWT_PRIVATE_KEY || "somethingsecret" },
            },
        },
    },
    db: {
        name: process.env.DB_NAME || "times-up",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || "27017",
        auth: {
            user: process.env.DB_USER,
            pass: process.env.DB_PASSWORD,
        },
    },
    sentry: {
        enabled: process.env.IS_SENTRY_ENABLED === "true",
        projectID: process.env.SENTRY_PROJECT_ID,
        key: process.env.SENTRY_KEY,
    },
    APIs: {
        wikipedia: { searchImagesURL: process.env.WIKIPEDIA_API_SEARCH_IMAGES_URL || "https://fr.wikipedia.org/w/rest.php/v1/search/title" },
        flickr: {
            key: process.env.FLICKR_API_KEY,
            searchImagesURL: process.env.FLICKR_API_SEARCH_IMAGES_URL || "https://www.flickr.com/services/rest",
        },
    },
};

if (Config.app.nodeEnv === "test") {
    Config.db.name += "-test";
}

module.exports = Config;