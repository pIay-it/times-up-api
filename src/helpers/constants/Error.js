exports.errorMetadata = {
    BAD_REQUEST: {
        code: 1,
        HTTPCode: 400,
    },
    UNAUTHORIZED: {
        code: 2,
        HTTPCode: 401,
    },
    INTERNAL_SERVER_ERROR: {
        code: 3,
        HTTPCode: 500,
    },
    PLAYERS_NAME_NOT_UNIQUE: {
        code: 4,
        HTTPCode: 400,
    },
    GAME_NOT_PLAYING: {
        code: 5,
        HTTPCode: 400,
    },
    GAME_NOT_FOUND: {
        code: 6,
        HTTPCode: 404,
    },
    CARD_NOT_FOUND: {
        code: 7,
        HTTPCode: 404,
    },
};