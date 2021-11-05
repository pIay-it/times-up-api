# ⏳ LIST OF CHANGES FOR TIME'S UP API

## 0.1.0 (2021-??-??)

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
* GitHub Actions configuration for testing and integrating commits. 

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

### 📚 Documentation

* `README.md` file.
* `CONTRIBUTING.md` file.
* Header for classes structure and footer for codes and values in APIDoc.
* Route `GET /` in APIDoc.
* `Card` class with possible category and status values in APIDoc.
* `Player` class in APIDoc.
* `Game` class with possible status values in APIDoc.
* `GameHistory` class in APIDoc.
* Route `GET /cards` in APIDoc.
* Route `GET /cards/:id` in APIDoc.
* Route `POST /cards` in APIDoc.
* Route `PATCH /cards/:id` in APIDoc.
* Route `DELETE /cards/:id` in APIDoc.
* Route `GET /games` in APIDoc.
* Route `GET /games/:id` in APIDoc.
* Route `POST /games` in APIDoc.

### 🧪 Tests

* Test environment set up. You can run it with `npm test`.
* Tests for route `GET /`.
* Tests for route `GET /cards`.
* Tests for route `GET /cards/:id`.
* Tests for route `POST /cards`.
* Tests for route `PATCH /cards/:id`.
* Tests for route `DELETE /cards/:id`.
* Tests for route `POST /games`.

### 📦 Packages

* Set of required packages installed for Express, mongoDB, route-validation, and more.