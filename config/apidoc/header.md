---

#### If you are not familiar with the game **Time's Up !**, please check out <a href="https://en.wikipedia.org/wiki/Time%27s_Up!_(game)" target="_blank">the Wikipedia page for general rules</a>.

**This API is proudly coded and provided by Play-IT, the official virtual game master dedicated to board players 🎲. The project is open source on <a href="https://github.com/pIay-it/times-up-api" target="_blank">GitHub</a>.**

**Meet our awesome team : <a href="https://edouarddemouy.fr" target="_blank">Édouard DEMOUY</a> and <a href="https://antoinezanardi.fr" target="_blank">Antoine ZANARDI</a>.**

<a href="https://github.com/pIay-it/times-up-api" target="_blank"><img src="https://img.shields.io/github/stars/pIay-it/times-up-api.svg?style=social&label=Feel%20free%20to%20leave%20a%20star" alt="GitHub stars"/></a>

---

# Structures

### Fields annotated with `*` are optional. Therefore, structures properties aren't always set.

## <a id="player-structure"></a>👤 Player

| Field       |           Type            | Description                                                                                                           |
|-------------|:-------------------------:|-----------------------------------------------------------------------------------------------------------------------|
| _id         |         ObjectId          | Player's ID.                                                                                                          |
| name        |          String           | Player's name. Must be unique among all players.                                                                      |
| **team***   |          String           | Player's team. Set if `game.options.players.areTeamUp` is `true`. If set, at least `2` players must belong to a team. |
| createdAt   |           Date            | When the player was created.                                                                                          |
| updatedAt   |           Date            | When the player was updated.                                                                                          |

## <a id="card-structure"></a>🃏️ Card

Games are made of cards to guess by players. Each card has a label, some categories and a difficulty to guess.

| Field                                             |            Type            | Description                                                                                                     |
|---------------------------------------------------|:--------------------------:|-----------------------------------------------------------------------------------------------------------------|
| _id                                               |          ObjectId          | Card's ID.                                                                                                      |
| **label***                                        |           String           | Card's label to be guessed.                                                                                     |
| **status***                                       |           String           | Card's status for the current game's round and turn. (_Possibilities: [Codes - Card Statuses](#card-statuses)_) |
| **categories***                                   |          String[]          | Card's categories. (_Possibilities: [Codes - Card Categories](#card-categories)_)                               |
| **difficulty***                                   |           Number           | Card's difficulty to guess. Set from 1 (easiest) to 3 (hardest).                                                |
| **playingTime***                                  |           Number           | Time in seconds taken by the speaker to play this card.                                                         |
| **description***                                  |           String           | Card's description which can help to guess it.                                                                  |
| **imageURL***                                     |           String           | Card's image URL which can help to guess it.                                                                    |
| createdAt                                         |            Date            | When the card was created.                                                                                      |
| updatedAt                                         |            Date            | When the card was updated.                                                                                      |

## <a id="game-structure"></a>🎲 Game

| Field<i style="margin-right: 125px"></i> |                   Type                    | Description                                                                                                                                                                                                                         |
|------------------------------------------|:-----------------------------------------:|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _id                                      |                 ObjectId                  | Game's ID.                                                                                                                                                                                                                          |
| players                                  |       [Player](#player-structure)[]       | Game's players. (_See: [Structures - Player](#player-structure)_)                                                                                                                                                                   |
| **teams***                               |                 Object[]                  | Game's different unique teams. Set only if `options.players.areTeam` is `true`.                                                                                                                                                     |
| <i style="margin-left: 15px"></i>⮑name   |                  String                   | Game's team name.                                                                                                                                                                                                                   |
| <i style="margin-left: 15px"></i>⮑color  |                  String                   | Game's team color in hexadecimal value.                                                                                                                                                                                             |
| cards                                    |         [Card](#card-structure)[]         | Game's cards. (_See: [Structures - Card](#card-structure)_)                                                                                                                                                                         |
| **anonymousUser***                       |                  Object                   | Game's anonymous creator data. Set only if game was created by an anonymous user.                                                                                                                                                   |
| <i style="margin-left: 15px"></i>⮑_id    |                  String                   | Game's anonymous creator ID. Prefixed by `anonymous-`.                                                                                                                                                                              |
| status                                   |                  String                   | Game's status. (_Possibilities: [Codes - Game Statuses](#game-statuses)_)                                                                                                                                                           |
| round                                    |                  Number                   | Game's current round. Final round can be either `3` or `4` depending on game's options.                                                                                                                                             |
| turn                                     |                  Number                   | Game's current turn for the current round. Set back to `1` when changing round.                                                                                                                                                     |
| speaker                                  |        [Player](#player-structure)        | Game's speaker for the current turn. The speaker is the one trying to make his team or partner guesses cards. (_See: [Structures - Player](#player-structure)_)                                                                     |
| **guesser***                             |        [Player](#player-structure)        | Game's guesser for the current turn, set only if `options.players.areTeamUp` is `false`. The guesser is the one trying to guess the card. (_See: [Structures - Player](#player-structure)_)                                         |
| queue                                    |   [Game Queue](#game-queue-structure)[]   | Game's order of passage for teams and players. The next team to play is the first element of this queue and the next speaker is the first element in its `players` field. (_See: [Structures - Game Queue](#game-queue-structure)_) |
| **history***                             | [Game History](#game-history-structure)[] | Game's history to keep track of all plays. (_See: [Structures - Game History](#game-history-structure)_)                                                                                                                            |
| **summary***                             |  [Game Summary](#game-summary-structure)  | Game's summary with scores of every team for each round and winners. (_See: [Structures - Game Summary](#game-summary-structure)_)                                                                                                  |
| options                                  |  [Game Options](#game-options-structure)  | Game's options to personalize the party. (_See: [Structures - Game Options](#game-options-structure)_)                                                                                                                              |
| createdAt                                |                   Date                    | When the game was created.                                                                                                                                                                                                          |
| updatedAt                                |                   Date                    | When the game was updated.                                                                                                                                                                                                          |

## <a id="game-queue-structure"></a>🔄 Game Queue

A game's queue lists the order of passage of each team and players in them. Then, there is as much as game's queues than different teams among all players. As the game progresses, the queue rolls in order to keep the first element the next team to play. Same for the `players` field, the first player is the next `speaker`.

| <i style="margin-left: 35px"></i>Field             |             Type              | Description                                                                                                                                                                                                                                                          |
|----------------------------------------------------|:-----------------------------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _id                                                |           ObjectId            | Game queue's ID.                                                                                                                                                                                                                                                     |
| **team***                                          |            String             | Expected team to play in this position in the queue. Set only if `options.players.areTeamUp` is `true`.                                                                                                                                                              |
| players                                            | [Player](#player-structure)[] | Order of passage for all players in the `team`. The first element is the next speaker for this team. When `options.players.areTeam` is `false`, the first player is the `speaker` and the second is the `guesser`. (_See: [Structures - Player](#player-structure)_) |

## <a id="game-history-structure"></a>📜 Game History

A game's history is a past play. All history is sorted in reverse chronological order.

| <i style="margin-left: 35px"></i>Field | Type                                 | Description                                                                                                                        |
|----------------------------------------|:------------------------------------:|------------------------------------------------------------------------------------------------------------------------------------|
| _id                                    | ObjectId                             | Game history's ID.                                                                                                                 |
| round                                  | Number                               | Game history's round.                                                                                                              |
| turn                                   | Number                               | Game history's turn.                                                                                                               |
| speaker                                | [Player](#player-structure)          | Game's speaker for the turn. The speaker is the one trying to make his team or partner guesses cards.                              |
| **guesser***                           | [Player](#player-structure)          | Game's guesser for the turn, set only if `options.players.areTeamUp` is `false`. The guesser is the one trying to guess the card.  |
| **cards***                             | [Card](#card-structure)[]            | Game's cards which status changed to `discarded`, `skipped` or `guessed`.                                                          |
| score                                  | Number                               | Total of points scored by the speaker for his team or himself.                                                                     |
| createdAt                              | Date                                 | When the play was created.                                                                                                         |
| updatedAt                              | Date                                 | When the play was updated.                                                                                                         |

## <a id="game-summary-structure"></a>🏆️ Game Summary

The game's summary generates itself as the rounds progress. It tells about the scores and the final winners when the game is `over`.

| Field<i style="margin-right: 125px"></i>           |                         Type                          | Description                                                                                                                                                        |
|----------------------------------------------------|:-----------------------------------------------------:|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **rounds***                                        | [Game Summary Round](#game-summary-round-structure)[] | Summary of each of the 3 or 4 rounds of the game with the score of every team or player. (_See: [Structures - Game Summary Score](#game-summary-round-structure)_) |
| **finalScores***                                   | [Game Summary Score](#game-summary-score-structure)[] | Final scores for each team or player. Only set if game status is set to `over`. (_See: [Structures - Game Summary Score](#game-summary-score-structure)_)          |
| **winners***                                       |                        Object                         | Winner(s) of the game. Only set if game status is set to `over`.                                                                                                   |
| <i style="margin-left: 15px"></i>⮑ players        |             [Player](#player-structure)[]             | Player(s) who won the game. Players can be from multiple teams when there is a tie. (_See: [Structures - Player](#player-structure)_)                              |
| <i style="margin-left: 15px"></i>⮑ **teams***     |                       String[]                        | Team(s) who have the most points among all rounds. Set only if `options.players.areTeamUp` is `true`.                                                              |

## <a id="game-summary-round-structure"></a>🏅️ Game Summary Round

When a round is over, its summary is generated with the score for each team or players.

| Field<i style="margin-right: 125px"></i>           |                         Type                          | Description                                                                                                                              |
|----------------------------------------------------|:-----------------------------------------------------:|------------------------------------------------------------------------------------------------------------------------------------------|
| _id                                                |                       ObjectId                        | Game's summary round ID.                                                                                                                 |
| number                                             |                        Number                         | Game's round number from `1` to `3` with default game's options.                                                                         |
| scores                                             | [Game Summary Score](#game-summary-score-structure)[] | For each team or player if there's no team, the round's score. (_See: [Structures - Game Summary Score](#game-summary-score-structure)_) |

## <a id="game-summary-score-structure"></a>💯 Game Summary Score

A score is always attached with the player or team who did it.

| Field<i style="margin-right: 125px"></i>           |                         Type                         | Description                                                                                                                                 |
|----------------------------------------------------|:----------------------------------------------------:|---------------------------------------------------------------------------------------------------------------------------------------------|
| _id                                                |                       ObjectId                       | Game's summary score ID.                                                                                                                    |
| **players***                                       |            [Player](#player-structure)[]             | Player(s) who scored who scored. Length is `1` if `options.players.areTeamUp` is `false`. (_See: [Structures - Player](#player-structure)_) |
| **team***                                          |                        String                        | Team who scored. Set only if `game.options.players.areTeamUp` is `true`.                                                                    |
| score                                              |                        Number                        | Player or team score.                                                                                                                       |

## <a id="game-options-structure"></a>⚙️ Game Options

In order to personalize the party, the game's options can be changed. By default, all options follow the official rules of the game.

| Field<i style="margin-right: 125px"></i>           |                   Type                   | Description                                                                                                                                |
|----------------------------------------------------|:----------------------------------------:|--------------------------------------------------------------------------------------------------------------------------------------------|
| players                                            |                  Object                  | Game's options related to players.                                                                                                         |
| <i style="margin-left: 15px"></i>⮑ areTeamUp      |                 Boolean                  | If set to `true`, teams are made among players. Else, players must win by themselves. Default is `true` based on official rules.           |
| cards                                              |                  Object                  | Game's options related to cards.                                                                                                           |
| <i style="margin-left: 15px"></i>⮑ count          |                  Number                  | Number of cards to guess during each rounds. Default is `40` based on official rules.                                                      |
| <i style="margin-left: 15px"></i>⮑ categories     |                 String[]                 | Cards categories to include for cards to guess. Default are all categories. (_Possibilities: [Codes - Card Categories](#card-categories)_) |
| <i style="margin-left: 15px"></i>⮑ difficulties   |                 Number[]                 | Cards difficulties to include for cards to guess. Default are all difficulties. `[1, 2, 3]`                                                |
| <i style="margin-left: 15px"></i>⮑ helpers        |                  Object                  | Game's options related to cards helpers that help players to guess cards.                                                                  |
| <i style="margin-left: 30px"></i>⮑ areDisplayed   |                 Boolean                  | If set to `true`, description and/or image can be displayed to guess the card more easily. Default is `true`.                              |
| rounds                                             |                  Object                  | Game's options related to rounds.                                                                                                          |
| <i style="margin-left: 15px"></i>⮑ count          |                  Number                  | Number of rounds for this game. Default is `3` based on official rules.                                                                    |
| <i style="margin-left: 15px"></i>⮑ turns          |                  Object                  | Game's options related to rounds turns.                                                                                                    |
| <i style="margin-left: 30px"></i>⮑ timeLimit      |                  Number                  | Time in seconds allowed for a player's turn. Default is `30` seconds based on official rules.                                              |

## <a id="error-structure"></a>⚠️ API Error

Structure returned from API HTTP requests when something went wrong.

| Field                |          Type          | Description                    |
|----------------------|:----------------------:|--------------------------------|
| code                 |         Number         | Unique code.                   |
| HTTPCode             |         Number         | HTTP Code.                     |
| type                 |         String         | Unique type.                   |
| data                 |          any           | Error's data. Can be anything. |

See: [Codes - Errors](#errors) for more information about each property and values.
