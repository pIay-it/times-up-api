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
    CARD_NOT_IN_GAME: {
        code: 8,
        HTTPCode: 400,
    },
    CARD_ALREADY_GUESSED: {
        code: 9,
        HTTPCode: 400,
    },
    CANT_SKIP_CARD: {
        code: 10,
        HTTPCode: 400,
    },
    CANT_PLAY_CARD_TWICE: {
        code: 11,
        HTTPCode: 400,
    },
    GAME_DOESNT_BELONG_TO_USER: {
        code: 12,
        HTTPCode: 401,
    },
    USER_HAS_ON_GOING_GAMES: {
        code: 13,
        HTTPCode: 400,
    },
    GAME_NOT_UPDATABLE: {
        code: 14,
        HTTPCode: 400,
    },
    FORBIDDEN_NEW_GAME_STATUS: {
        code: 15,
        HTTPCode: 400,
    },
    CANT_SHUFFLE_CARDS: {
        code: 16,
        HTTPCode: 400,
    },
    CANT_UPDATE_PLAYERS: {
        code: 17,
        HTTPCode: 400,
    },
    PLAYER_NOT_FOUND: {
        code: 18,
        HTTPCode: 404,
    },
    UNKNOWN_TEAM: {
        code: 19,
        HTTPCode: 404,
    },
    TEAM_TOO_SMALL: {
        code: 20,
        HTTPCode: 400,
    },
};