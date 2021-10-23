---

#### If you are not familiar with the game **Time's Up !**, please check out <a href="https://en.wikipedia.org/wiki/Time%27s_Up!_(game)" target="_blank">the Wikipedia page for general rules</a>.

**This API is proudly coded and provided by Play-IT, the official virtual game master dedicated to board players 🎲. The project is open source on <a href="https://github.com/pIay-it/times-up-api" target="_blank">GitHub</a>.**

**Meet our awesome team : <a href="https://edouarddemouy.fr" target="_blank">Édouard DEMOUY</a> and <a href="https://antoinezanardi.fr" target="_blank">Antoine ZANARDI</a>.**

<a href="https://github.com/pIay-it/times-up-api" target="_blank"><img src="https://img.shields.io/github/stars/pIay-it/times-up-api.svg?style=social&label=Feel%20free%20to%20leave%20a%20star" alt="GitHub stars"/></a>

---

# Classes

### Fields annotated with `*` are optional. Therefore, classes properties aren't always set.

## <a id="error-class"></a>⚠️ API Error

Class returned from API HTTP requests when something went wrong.

| Field                | Type     | Description                                                         |
|----------------------|:--------:|---------------------------------------------------------------------|
| code                 | Number   | Unique code.                                                        |
| HTTPCode             | Number   | HTTP Code.                                                          |
| type                 | String   | Unique type.                                                        |
| data                 | any      | Error's data. Can be anything.                                      |

See: [Codes - Errors](#errors) for more information about each property and values.
