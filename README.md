# ⏳ Time's Up API

[![GitHub release](https://img.shields.io/github/release/pIay-it/times-up-api.svg)](https://GitHub.com/pIay-it/times-up-api/releases/)
[![GitHub license](https://img.shields.io/github/license/pIay-it/times-up-api.svg)](https://github.com/antoinezanardi/https://img.shields.io/github/license/werewolves-assistant-api.svg/blob/master/LICENSE)
[![GitHub Actions Build](https://github.com/pIay-it/times-up-api/actions/workflows/build.yml/badge.svg)](https://github.com/pIay-it/times-up-api/actions/workflows/build.yml)
[![GitHub Actions Deploy](https://github.com/pIay-it/times-up-api/actions/workflows/deploy-master.yml/badge.svg)](https://github.com/pIay-it/times-up-api/actions/workflows/deploy-master.yml)
[![Contributions are welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/pIay-it/times-up-api/issues)

[![ForTheBadge open-source](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com)
[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://GitHub.com/antoinezanardi/)
[![ForTheBadge uses-js](http://ForTheBadge.com/images/badges/uses-js.svg)](https://GitHub.com/pIay-it/times-up-api)

## 📋 Table of Contents

1. ⏳ [What is this API ?](#what-is-this-api)
2. 🔍 [Let's try !](#lets-try)
3. 📚 [API Documentation](#api-documentation)
4. 📈 [Versions & changelog](#versions)
5. ☑️ [Code analysis and consistency](#code-analysis-and-consistency)
6. 🔨 [Installation](#installation)
7. 🔌 [Let's go](#lets-go)
8. ⚙️ [Other useful commands](#other-useful-commands)
9. ©️ [License](#license)
10. ❤️ [Contributors](#contributors)

## <a name="what-is-this-api">⏳ What is this API ?</a>
This API provides various data through HTTP requests to manage Time's Up parties.

This is the project's API used by [**Time's Up Web**](https://github.com/pIay-it/times-up-web), the main web **VueJS** client.  

## <a name="lets-try">🔍 Let's try !</a>
Two versions are available for testing this API:

✨ <a href="https://times-up-api.play-it.io" target="_blank">**Main API**</a> _(Base URL: https://times-up-api.play-it.io)_

🔧 <a href="https://sandbox.times-up-api.play-it.io" target="_blank">**Sandbox API**</a> _(Base URL: https://sandbox.times-up-api.play-it.io)_

**Sandbox API** may contain some bugs and unexpected behaviors as its purpose is to test new features before deploying on **main API**.

Both APIs are running on a server with the following configuration:
- **OS**: `Debian GNU/Linux 10 (buster)`
- **NodeJS**: `v14.18.1`
- **NPM**: `v6.14.15`
- **MongoDB shell version**: `v4.4.10`

The MongoDB database is protected under username and password authentication.

## <a name="api-documentation">📚 API Documentation</a>

Documentation is available for both versions:

* **✨ [Main API Documentation](https://times-up-api.play-it.io/apidoc)**
* **🔧 [Sandbox API Documentation](https://sandbox.times-up-api.play-it.io/apidoc)**

Note that contributors try their best to maintain documentations up to date. If you find any typos or oversights, please open an issue, or a pull request.

## <a name="versions">📈 Versions & changelog</a>

Each change when a new version comes up is listed in the <a href="https://github.com/antoinezanardi/werewolves-assistant-api/blob/master/CHANGELOG.md" target="_blank">CHANGELOG.md file</a> placed at project's root.

Also, you can keep up with changes by watching releases with the **Watch GitHub button** at the top of this page.

Current release on **main API** is [![GitHub release](https://img.shields.io/github/release/pIay-it/times-up-api.svg)](https://GitHub.com/pIay-it/times-up-api/releases/).

✨ <a href="https://times-up-api.play-it.io" target="_blank">**Main API**</a> is updated when commits are merged into the `master` branch.

🔧 <a href="https://sandbox.times-up-api.play-it.io" target="_blank">**Sandbox API**</a> is updated when commits are merged into the `staging` branch.

**[GitHub Actions](https://github.com/pIay-it/times-up-api/actions)** helps the project to be automatically updated by deploying new versions for both **Sandbox** and **Main** APIs. Please refer to the **[workflows](https://github.com/pIay-it/times-up-api/tree/master/.github/workflows)** for more details.

#### 🏷️ <a href="https://github.com/pIay-it/times-up-api/releases" target="_blank">All releases for this project are available here</a>.

## <a name="code-analysis-and-consistency">☑️ Code analysis and consistency</a>

In order to keep the code clean, consistent and free of bad JS practises, **[ESLint](https://eslint.org/)** is installed with more than **225 rules activated** !

Complete list of all enabled rules is available in the **[.eslintrc.js file](https://github.com/pIay-it/times-up-api/blob/master/.eslintrc.js)**.

## <a name="installation">🔨 Installation</a>

1. Install dependencies with `npm install` (add `--production` to omit dev dependencies).
2. Copy `.env.example` and paste it as `.env`.
3. Replace environment values in the fresh new `.env` file if necessary (When **⚠️️ Required** is specified):
    * **PORT**: Which port the API must run.
        - _**Not required - Default value**: `4242`_
    * **JWT_PRIVATE_KEY**: Encryption key used for JSON Web Token.
       - _**Not required - Default value**: `somethingsecret`_
    * **DB_USER**: User for authenticating into the MongoDB database.
        - _**⚠️ Required if MongoDB auth is enabled**_
    * **DB_PASSWORD**: Password for authenticating into the MongoDB database.
        - _**⚠️ Required if MongoDB auth is enabled**_
    * **DB_NAME**: Name of the MongoDB database.
        - _**Not required - Default value**: `times-up`_
    * **BASIC_USERNAME**: Username for basic authentication.
        - _**Not required - Default value**: `root`_
    * **BASIC_PASSWORD**: Password for basic authentication.
        - _**Not required - Default value**: `secret`_
    * **WIKIPEDIA_API_SEARCH_IMAGES_URL**: Wikipedia APIs URL for retrieving images from articles.
       - _**Not required - Default value**: `https://fr.wikipedia.org/w/rest.php/v1/search/title`_
    * **FLICKR_API_SEARCH_IMAGES_URL**: Flickr APIs URL for retrieving images from galleries and collections.
       - _**Not required - Default value**: `https://www.flickr.com/services/rest`_
    * **FLICKR_API_KEY**: Flickr APIs key.
        - _**⚠️ Required for Flickr API calls**_
    * **IS_SENTRY_ENABLED**: Set to `true` if you want errors to be caught and sent to Sentry.
        - _**Not required**_
    * **SENTRY_PROJECT_ID**: Sentry project's ID. 
        - _**⚠️ Required if Sentry is enabled**_
    * **SENTRY_KEY**: Sentry secret key.
        - _**⚠️ Required if Sentry is enabled**_

## <a name="lets-go">🔌 Let's go</a>

To start the API **on development mode**, simply run `npm start`.

To start the API **on production mode**, run `npm run start_sandbox` or `npm run start_production`.

## <a name="other-useful-commands">⚙️ Other useful commands</a>
- **Tests**: `npm run test` runs various tests to check API endpoints.
- **Lint**: `npm run lint` checks for code style. Based on AirBnB configuration with many more rules.
- **Doc**: `npm run doc` generates doc for API.

## <a name="license">©️ License</a>

This project is licensed under the [MIT License](http://opensource.org/licenses/MIT).

## <a name="contributors">❤️ Contributors</a>

If you want to contribute to this project, please read the [**contribution guide**](https://github.com/pIay-it/times-up-api/pulls/CONTRIBUTING.md).