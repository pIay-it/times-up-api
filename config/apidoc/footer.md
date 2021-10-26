# Codes & Values

## <a id="card-categories"></a>🃏️ Card Categories

A card has at least one category which allows to sort them.

Some categories are called `sub-categories`, meaning that attaching it to a card implies its main category to implicitly be attached too. For example, a card with the `animal` category will also have the `nature` category by default.

| Category         | Description                                                                       | Examples                                                                                                                              | Sub-category of                |
|:----------------:|:---------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------:|
| 🧑‍🎤 personality    | A well-known or popular real-life person.                                         | - Bill Gates<br/>- Barack Obama<br/>- Madonna<br/>- Will Smith                                                                        | /                              |
| 🧛 character      | A person or creature in a novel, movie, video-game or in any kind of fiction.     | - Peter Pan<br/>- Pikachu<br/>- Harry Potter<br/>- Sherlock Holmes                                                                    | /                              |
| 🤿 activity       | Anything related to spend time, earn money or accomplish things.                  | - Teacher<br/>- Scuba dive<br/>- Ski<br/>- Sleep                                                                                      | /                              |
| 🔨 object         | Anything that has a fixed shape and form, perceptible, touchable and not alive.   | - Hammer<br/>- Cup<br/>- Plane<br/>- Table                                                                                            | /                              |
| 🍔 food           | Any substance that can be eaten or drank by people or animals.                    | - Hamburger<br/>- Coca Cola<br/>- Water<br/>- Sushi                                                                                   | /                              |
| 🌳 nature         | Anything related to nature.                                                       | - Waterfall<br/>- Oak<br/>- Star<br/>- Dog                                                                                            | /                              |
| 📍 place          | A location or area. Can be either a building, a nation or even a planet.          | - Earth<br/>- Hospital<br/>- Corsica<br/>- U.S.A                                                                                      | /                              |
| 🕰️ event          | A more or less important thing that happened at a specific time.                  | - The French Revolution<br/>- The Birth of The Moon<br/>- The Olympic Games<br/>- French Football team becomes world champion         | /                              |
| 🎨 art            | Anything created by a human being in an artistic way.                             | - The Thinker<br/>- The Ceiling of the Sistine Chapel<br/>- Kheops Pyramids<br/>- La Commedia Dell'Arte                               | /                              |
| 🤖 technology     | Any object related to technologies and sciences.                                  | - Computer<br/>- Robot<br/>- Plane<br/>- Television                                                                                   | 🔨 object                       |
| 👚 clothes        | Object worn to cover the body.                                                    | - Sock<br/>- Jeans<br/>- Hat<br/>- Coat                                                                                               | 🔨 object                       |
| 🎥 movie          | Short or long animation that tells a story.                                       | - Back To The Future<br/>- Cars<br/>- Dumbo<br/>- Spirited Away                                                                       | 🎨 art                          |
| 📺 tv-series      | A group of episodes broadcast in regular intervals.                               | - Breaking Bad<br/>- Rick & Morty<br/>- The Office<br/>- One Piece                                                                    | 🎨 art                          |
| 📚 book           | A story written on pages with words and/or images.                                | - Astérix<br/>- My Hero Academia<br/>- Moby Dick<br/>- The Odyssey                                                                    | 🎨 art                          |
| 🎮 video-game     | A game played on a console, arcade machine or computer.                           | - Pokémon<br/>- World Of Warcraft<br/>- Donkey Kong<br/>- Pac-Man                                                                     | 🎨 art                          |
| 🖼️ painting       | An image painted on a frame for decoration.                                       | - La Joconde<br/>- Guernica<br/>- Narcissus<br/>- A Friend In Need                                                                    | 🎨 art                          |
| 📑 theatre-play   | A work of drama consisting of dialogues between actors.                           | - Hamlet<br/>- Macbeth<br/>- The Phantom Of The Opera<br/>- Cats                                                                      | 🎨 art                          |
| 🗿 sculpture      | A statue carved in a material representing something.                             | - The Thinker<br/>- Manneken Pis<br/>- David<br/>- The Great Sphinx of Giza                                                           | 🎨 art                          |
| 📐 architecture   | A building or structure made by a human being.                                    | - Kheops Pyramids<br/>- Airport<br/>- Eiffel Tower<br/>- Birdhouse                                                                    | 🎨 art                          |
| 🎶 music          | A collection of sounds, with or without lyrics.                                   | - Super Mario Theme<br/>- Viva la Vida<br/>- Nutcracker<br/>- Skibidi                                                                 | 🎨 art                          |
| 🐈 animal         | Any living creature.                                                              | - Cat<br/>- Octopus<br/>- Raven<br/>- Frog                                                                                            | 🌳 nature                       |
| 🥊 sport          | An activity involving skills and/or physical efforts individually or in a team.   | - Football<br/>- Golf<br/>- Chess<br/>- E-Sport                                                                                       | 🤿 activity                     |
| 🩺 job            | An activity that a person does regularly to earn some money.                      | - Doctor<br/>- Entrepreneur<br/>- Cashier<br/>- Barman                                                                                | 🤿 activity                     |

## <a id="errors"></a>⚠️ Errors

If you have an error from the API, you'll get a generic structure. (_See: [Classes - Error](#error-class)_)

Description for each case below :   

| Code | Type                                       | HTTP Code |                 Description                                                                               |
|:----:|:------------------------------------------:|:---------:|-----------------------------------------------------------------------------------------------------------|
| 1    | BAD_REQUEST                                |    400    | You provided incorrect params.                                                                            |
| 2    | UNAUTHORIZED                               |    401    | You're not authorized.                                                                                    |
| 3    | NOT_FOUND                                  |    404    | The requested resource is not found.                                                                      |
| 4    | INTERNAL_SERVER_ERROR                      |    500    | The server got an error, this is not your fault.                                                          |