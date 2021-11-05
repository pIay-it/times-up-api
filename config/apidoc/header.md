---

#### If you are not familiar with the game **Time's Up !**, please check out <a href="https://en.wikipedia.org/wiki/Time%27s_Up!_(game)" target="_blank">the Wikipedia page for general rules</a>.

**This API is proudly coded and provided by Play-IT, the official virtual game master dedicated to board players 🎲. The project is open source on <a href="https://github.com/pIay-it/times-up-api" target="_blank">GitHub</a>.**

**Meet our awesome team : <a href="https://edouarddemouy.fr" target="_blank">Édouard DEMOUY</a> and <a href="https://antoinezanardi.fr" target="_blank">Antoine ZANARDI</a>.**

<a href="https://github.com/pIay-it/times-up-api" target="_blank"><img src="https://img.shields.io/github/stars/pIay-it/times-up-api.svg?style=social&label=Feel%20free%20to%20leave%20a%20star" alt="GitHub stars"/></a>

---

# Classes

### Fields annotated with `*` are optional. Therefore, classes properties aren't always set.

## <a id="player-class"></a>👤 Player

| Field                | Type               | Description                                                                                                                           |
|----------------------|:------------------:|---------------------------------------------------------------------------------------------------------------------------------------|
| _id                  | ObjectId           | Player's ID.                                                                                                                          |
| name                 | String             | Player's name. Must be unique among all players.                                                                                      |
| **team***            | String             | Player's team. Set if `game.options.players.areTeamUp` is `true`. If set, at least `2` players must belong to a team.                 |

## <a id="card-class"></a>🃏️ Card

Games are made of cards to guess by players. Each card has a label, some categories and a difficulty to guess.

| Field                                             | Type                       | Description                                                                                                                                   |
|---------------------------------------------------|:--------------------------:|-----------------------------------------------------------------------------------------------------------------------------------------------|
| _id                                               | ObjectId                   | Card's ID.                                                                                                                                    |
| **label***                                        | String                     | Card's label to be guessed.                                                                                                                   |
| **status***                                       | String                     | Card's status for the current game's round and turn. (_Possibilities: [Codes - Card Statuses](#card-statuses)_)                               |
| **categories***                                   | String[]                   | Card's categories. (_Possibilities: [Codes - Card Categories](#card-categories)_)                                                             |
| **difficulty***                                   | Number                     | Card's difficulty to guess. Set from 1 (easiest) to 3 (hardest).                                                                              |
| **timeToGuess***                                  | Number                     | Set when `status` is `guessed`. Time in seconds taken by the speaker to make his team guess the card.                                         |
| **description***                                  | String                     | Card's description which can help to guess it.                                                                                                |
| **imageURL***                                     | String                     | Card's image URL which can help to guess it.                                                                                                  |
| createdAt                                         | Date                       | When the card was created.                                                                                                                    |
| updatedAt                                         | Date                       | When the card was updated.                                                                                                                    |

## <a id="game-class"></a>🎲 Game

| Field<i style="margin-right: 125px"></i>            | Type                                    | Description                                                                                                                                                                                      |
|----------------------------------------------------|:----------------------------------------:|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _id                                                | ObjectId                                 | Game's ID.                                                                                                                                                                                        |
| players                                            | [Player](#player-class)[]                | Game's players. (_See: [Classes - Player](#player-class)_)                                                                                                                                        |
| cards                                              | [Card](#card-class)[]                    | Game's cards. (_See: [Classes - Card](#card-class)_)                                                                                                                                              |
| status                                             | String                                   | Game's status. (_Possibilities: [Codes - Game Statuses](#game-statuses)_)                                                                                                                         |
| round                                              | Number                                   | Game's current round. Final round can be either `3` or `4` depending on game's options.                                                                                                           |
| turn                                               | Number                                   | Game's current turn for the current round. Set back to `1` when changing round.                                                                                                                   |
| speaker                                            | [Player](#player-class)                  | Game's speaker for the current turn. The speaker is the one trying to make his team or partner guesses cards. (_See: [Classes - Player](#player-class)_)                                          |
| **guesser***                                       | [Player](#player-class)                  | Game's guesser for the current turn, set only if `options.players.areTeamUp` is `false`. The guesser is the one trying to guess the card. (_See: [Classes - Player](#player-class)_)              |
| options                                            | Object                                   | Game's options to personalize the party.                                                                                                                                                          |
| <i style="margin-left: 15px"></i>⮑ players        | Object                                   | Game's options related to players.                                                                                                                                                                |
| <i style="margin-left: 30px"></i>⮑ areTeamUp      | Boolean                                  | If set to `true`, teams are made among players. Else, players must win by themselves. Default is `true` based on official rules.                                                                  |
| <i style="margin-left: 15px"></i>⮑ cards          | Object                                   | Game's options related to cards.                                                                                                                                                                  |
| <i style="margin-left: 30px"></i>⮑ count          | Number                                   | Number of cards to guess during each rounds. Default is `40` based on official rules.                                                                                                             |
| <i style="margin-left: 30px"></i>⮑ categories     | String[]                                 | Cards categories to include for cards to guess. Default are all categories. (_Possibilities: [Codes - Card Categories](#card-categories)_)                                                        |
| <i style="margin-left: 30px"></i>⮑ difficulties   | Number[]                                 | Cards difficulties to include for cards to guess. Default are all difficulties. `[1, 2, 3]`                                                                                                       |
| <i style="margin-left: 30px"></i>⮑ helpers        | Object                                   | Game's options related to cards helpers that help players to guess cards.                                                                                                                         |
| <i style="margin-left: 45px"></i>⮑ areDisplayed   | Boolean                                  | If set to `true`, description and/or image can be displayed to guess the card more easily. Default is `true`.                                                                                     |
| <i style="margin-left: 15px"></i>⮑ rounds         | Object                                   | Game's options related to rounds.                                                                                                                                                                 |
| <i style="margin-left: 30px"></i>⮑ count          | Number                                   | Number of rounds for this game. Default is `3` based on official rules.                                                                                                                           |
| <i style="margin-left: 30px"></i>⮑ turns          | Object                                   | Game's options related to rounds turns.                                                                                                                                                           |
| <i style="margin-left: 45px"></i>⮑ timeLimit      | Number                                   | Time in seconds allowed for a player's turn. Default is `30` seconds based on official rules.                                                                                                     |
| **history***                                       | [Game History](#game-history-class)[]    | Game's history to keep track of all plays. (_See: [Classes - Game History](#game-history-class)_)                                                                                                 |
| createdAt                                          | Date                                     | When the game was created.                                                                                                                                                                        |
| updatedAt                                          | Date                                     | When the game was updated.                                                                                                                                                                        |

## <a id="game-history-class"></a>📜 Game History

A game's history is a past play. All history is sorted in reverse chronological order.

| <i style="margin-left: 35px"></i>Field             | Type                                 | Description                                                                                                                                          |
|----------------------------------------------------|:------------------------------------:|------------------------------------------------------------------------------------------------------------------------------------------------------|
| _id                                                | ObjectId                             | Game history's ID.                                                                                                                                   |
| round                                              | Number                               | Game history's round.                                                                                                                                |
| turn                                               | Number                               | Game history's turn.                                                                                                                                 |
| speaker                                            | [Player](#player-class)              | Game's speaker for the turn. The speaker is the one trying to make his team or partner guesses cards.                                                |
| **guesser***                                       | [Player](#player-class)              | Game's guesser for the turn, set only if `options.players.areTeamUp` is `false`. The guesser is the one trying to guess the card.                    |
| **cards***                                         | [Card](#card-class)[]                | Game's cards which status changed to `discarded`, `skipped` or `guessed`.                                                                            |
| score                                              | Number                               | Total of points scored by the speaker for his team or himself.                                                                                       |
| createdAt                                          | Date                                 | When the play was created.                                                                                                                           |
| updatedAt                                          | Date                                 | When the play was updated.                                                                                                                           |

## <a id="error-class"></a>⚠️ API Error

Class returned from API HTTP requests when something went wrong.

| Field                | Type     | Description                                                         |
|----------------------|:--------:|---------------------------------------------------------------------|
| code                 | Number   | Unique code.                                                        |
| HTTPCode             | Number   | HTTP Code.                                                          |
| type                 | String   | Unique type.                                                        |
| data                 | any      | Error's data. Can be anything.                                      |

See: [Codes - Errors](#errors) for more information about each property and values.
