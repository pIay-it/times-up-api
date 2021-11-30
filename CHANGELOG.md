# ⏳ LIST OF CHANGES FOR TIME'S UP API

## 0.1.1 (2021-??-??)

### 🚀 New features

* [#10](https://github.com/pIay-it/times-up-api/issues/10) - Shuffle cards after each turn.
* [#11](https://github.com/pIay-it/times-up-api/issues/11) - Record `0` score in game summary.

### 🐛 Bug fixes

* [#13](https://github.com/pIay-it/times-up-api/issues/13) - Incompatibility between Label uppercase and accent during cards creations.

### ♻️ Refactoring

* [#12](https://github.com/pIay-it/times-up-api/issues/12) - Change `SENTRY_ENABLED` to `IS_SENTRY_ENABLED` in env.

### 📚 Documentation

* [#9](https://github.com/pIay-it/times-up-api/issues/9) - `createdAt` and `updatedAt` fields added for `Player` structure.

### 📦 Packages

* `apidoc` updated to version `0.50.2`
* `eslint` updated to version `8.3.0`
* `mongoose` updated to version `6.0.14`

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