# ⏳ Time's Up API

[![GitHub release](https://img.shields.io/github/release/pIay-it/times-up-api.svg)](https://GitHub.com/pIay-it/times-up-api/releases/)
[![GitHub license](https://img.shields.io/github/license/pIay-it/times-up-api.svg)](https://github.com/antoinezanardi/https://img.shields.io/github/license/werewolves-assistant-api.svg/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/pIay-it/times-up-api.svg?branch=master)](https://travis-ci.org/pIay-it/times-up-api)
[![Known Vulnerabilities](https://snyk.io/test/github/pIay-it/times-up-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/pIay-it/times-up-api?targetFile=package.json)
[![Contributions are welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/pIay-it/times-up-api/issues)

[![ForTheBadge open-source](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com)
[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://GitHub.com/antoinezanardi/)
[![ForTheBadge uses-js](http://ForTheBadge.com/images/badges/uses-js.svg)](https://GitHub.com/pIay-it/times-up-api)

## 📋 Table of Contents

1. ⏳ [What is this API ?](#what-is-this-api)
2. 🔌 [Let's go](#lets-go)
3. ⚙️ [Other useful commands](#other-useful-commands)
4. ©️ [License](#license)
5. ❤️ [Contributors](#contributors)

## <a name="what-is-this-api">⏳ What is this API ?</a>
This API provides various data through HTTP requests to manage Time's Up parties.

This is the project's API used by [**Time's Up Web**](https://github.com/pIay-it/times-up-web), the main web **VueJS** client.  

## <a name="installation">🔨 Installation</a>

1. Install dependencies with `npm install` (add `--production` to omit dev dependencies).
2. Copy `.env.example` and paste it as `.env`.
3. Replace environment values in the fresh new `.env` file if necessary (When **⚠️️ Required** is specified):
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
    * **PORT**: Which port the API must run.
        - _**Not required - Default value**: `4242`_
    * **SENTRY_ENABLED**: Set to `true` if you want errors to be caught and sent to Sentry.
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