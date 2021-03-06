# ⏳ LIST OF CHANGES FOR TIME'S UP API

## 0.3.2 (2022-05-02)

### 🐛 Bug fixes

* No duplicate cards with the same label in a game.

### 📦 Packages

* `@commitlint/cli` installed with version `16.2.4`.
* `@commitlint/config-conventional` installed with version `16.2.4`.
* `husky` installed with version `7.0.4`.
* `@sentry/node` updated to version `6.19.7`.
* `@sentry/tracing` updated to version `6.19.7`.
* `apidoc` updated to version `0.51.1`.
* `axios` updated to version `0.27.2`.
* `eslint` updated to version `8.14.0`.
* `express` updated to version `4.18.1`.
* `express-rate-limit` updated to version `6.4.0`.
* `mocha` updated to version `10.0.0`.
* `mongoose` updated to version `6.3.1`.
* `nodemon` updated to version `2.0.16`.

---

## 0.3.1 (2022-04-12)

### 🐛 Bug fixes

* Can't make a game play if there is no card played.

### 📦 Packages

* `@sentry/node` updated to version `6.19.6`.
* `@sentry/tracing` updated to version `6.19.6`.
* `apidoc` updated to version `0.51.0`.
* `body-parser` updated to version `1.20.0`.
* `eslint` updated to version `8.13.0`.
* `mongoose` updated to version `6.2.10`.

---

## 0.3.0 (2022-03-18)

### 🚀 New features

* [#34](https://github.com/pIay-it/times-up-api/issues/34) - Route for changing player's name and team when game is preparing.
* [#35](https://github.com/pIay-it/times-up-api/issues/35) - Team's color.

### 📦 Packages 

* `@sentry/node` updated to version `6.18.2`.
* `@sentry/tracing` updated to version `6.18.2`.
* `apidoc` updated to version `0.50.5`.
* `axios` updated to version `0.26.1`.
* `body-parser` updated to version `1.19.2`.
* `camelcase` updated to version `6.3.0`.
* `chai` updated to version `4.3.6`.
* `dotenv` updated to version `16.0.0`.
* `eslint` updated to version `8.11.0`.
* `express` updated to version `4.17.3`.
* `express-rate-limit` updated to version `6.3.0`.
* `mocha` updated to version `9.2.2`.
* `mongoose` updated to version `6.2.2`.
* `passport` updated to version `0.5.2`.
* `qs` updated to version `6.10.3`.
* `xss` updated to version `1.0.11`.

---

## 0.2.0 (2021-12-15)

### 🚀 New features

* [#24](https://github.com/pIay-it/times-up-api/issues/24) - Get games by status.
* [#25](https://github.com/pIay-it/times-up-api/issues/25) - Route for shuffling cards.
* [#27](https://github.com/pIay-it/times-up-api/issues/27) - Get games in specific order.
* [#28](https://github.com/pIay-it/times-up-api/issues/28) - Get games by `anonymousUser`.
* [#29](https://github.com/pIay-it/times-up-api/issues/29) - Get cards in specific order.

### 🛣 Routes

* [#25](https://github.com/pIay-it/times-up-api/issues/25) - Route `POST /games/:id/cards/shuffle` for shuffling cards.
* [#26](https://github.com/pIay-it/times-up-api/issues/26) - Route `GET /images` for retrieving images from multiple APIs.

### 📚 Documentation

* [#25](https://github.com/pIay-it/times-up-api/issues/25) - Route `POST /games/:id/cards/shuffle` in APIDoc.
* [#26](https://github.com/pIay-it/times-up-api/issues/26) - Route `GET /images` in APIDoc.

### 📦 Packages

* `axios` installed with version `0.24.0`.
* `camelcase` installed with version `6.2.1`.
* `qs` installed with version `6.10.2`.
* `@sentry/node` updated to version `6.16.1`.
* `@sentry/tracing` updated to version `6.16.1`.
* `body-parser` updated to version `1.19.1`.
* `express-validator` updated to version `6.14.1`.
* `mongoose` updated to version `6.1.2`.

---

## 0.1.2 (2021-12-09)

### 🚀 New features

* [#17](https://github.com/pIay-it/times-up-api/issues/17) - JWT authentication for anonymous users.
* [#18](https://github.com/pIay-it/times-up-api/issues/18) - Decimal seconds for `playingTime` card's field.
* [#19](https://github.com/pIay-it/times-up-api/issues/19) - Change `timeToGuess` for `playingTime` for game's cards.
* [#20](https://github.com/pIay-it/times-up-api/issues/20) - Prevent to play card with `to-guess` status.

### 📦 Packages

* `jsonwebtoken` installed with version `8.5.1`.
* `passport-jwt` installed with version `4.0.0`.
* `passport-local` installed with version `1.0.0`.
* `uniqid` installed with version `5.4.0`.
* `@sentry/node` updated to version `6.16.0`.
* `@sentry/tracing` updated to version `6.16.0`.
* `eslint` updated to version `8.4.1`.
* `mongoose` updated to version `6.1.0`.

---

## 0.1.1 (2021-11-30)

### 🚀 New features

* [#10](https://github.com/pIay-it/times-up-api/issues/10) - Shuffle cards after each turn.
* [#11](https://github.com/pIay-it/times-up-api/issues/11) - Record `0` score in game summary.
* [#14](https://github.com/pIay-it/times-up-api/issues/14) - Allow empty strings for optional request body parameters.

### 🐛 Bug fixes

* [#13](https://github.com/pIay-it/times-up-api/issues/13) - Incompatibility between Label uppercase and accent during cards creations.

### ♻️ Refactoring

* [#12](https://github.com/pIay-it/times-up-api/issues/12) - Change `SENTRY_ENABLED` to `IS_SENTRY_ENABLED` in env.

### 📚 Documentation

* [#9](https://github.com/pIay-it/times-up-api/issues/9) - `createdAt` and `updatedAt` fields added for `Player` structure.

### 📦 Packages

* `apidoc` updated to version `0.50.2`.
* `eslint` updated to version `8.3.0`.
* `mongoose` updated to version `6.0.14`.

---

## 0.1.0 (2021-11-17)

### 🚀 New features

* Starting this awesome project.
* Express server and project architecture.
* `forever` configs for `sandbox` and `production` are ready to be deployed on the future server.
* `eslint` config and rules.
* Sentry ready to catch errors and send notifications to Slack.
* Basic authentication with `passport` for some routes.
* Main config file with `.env` variables.
* Script `update-version` to update project version on `package.json`, `apidoc` config and API main route.
* MIT license. 
* GitHub Actions configuration for testing, integrating commits and deploying staging branch. 

### 🛣 Routes

* Route `GET /` for checking API status and version.
* Route `GET /cards` for getting all available cards. Filter by label, categories or difficulty, limit results, specify fields.
* Route `GET /cards/:id` for getting a card with an ID.
* Route `POST /cards` for creating a new card protected with basic authentication.
* Route `PATCH /cards/:id` for updating a card protected with basic authentication.
* Route `DELETE /cards/:id` for deleting a card protected with basic authentication.
* Route `GET /games` for getting all available games. Limit results, specify fields.
* Route `GET /games/:id` for getting a game with an ID.
* Route `POST /games` for creating a new game.
* Route `PATCH /games/:id` for updating a game protected with basic authentication.
* Route `DELETE /games/:id` for deleting a game protected with basic authentication.
* Route `POST /games/:id/play` for making a play into a game.

### 📚 Documentation

* `README.md` file.
* `CONTRIBUTING.md` file.
* Header for structures structure and footer for codes and values in APIDoc.
* Route `GET /` in APIDoc.
* `Card` structure with possible category and status values in APIDoc.
* `Player` structure in APIDoc.
* `Game` structure with possible status values in APIDoc.
* `Game History` structure in APIDoc.
* `Game Options` structure in APIDoc.
* `Game Summary` structure in APIDoc.
* `Game Summary Round` structure in APIDoc.
* `Game Summary Score` structure in APIDoc.
* Route `GET /cards` in APIDoc.
* Route `GET /cards/:id` in APIDoc.
* Route `POST /cards` in APIDoc.
* Route `PATCH /cards/:id` in APIDoc.
* Route `DELETE /cards/:id` in APIDoc.
* Route `GET /games` in APIDoc.
* Route `GET /games/:id` in APIDoc.
* Route `POST /games` in APIDoc.
* Route `PATCH /games/:id` in APIDoc.
* Route `DELETE /games/:id` in APIDoc.
* Route `POST /games/:id/play` in APIDoc.

### 🧪 Tests

* Test environment set up. You can run it with `npm test`.
* Tests for route `GET /`.
* Tests for route `GET /cards`.
* Tests for route `GET /cards/:id`.
* Tests for route `POST /cards`.
* Tests for route `PATCH /cards/:id`.
* Tests for route `DELETE /cards/:id`.
* Tests for route `GET /games`.
* Tests for route `GET /games/:id`.
* Tests for route `POST /games`.
* Tests for route `PATCH /games/:id`.
* Tests for route `DELETE /games/:id`.
* Tests for route `POST /games/:id/play`.

### 📦 Packages

* Set of required packages installed for Express, mongoDB, routes validation, and more.