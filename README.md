# GamebattlesMatchFinder
This is an application which will automatically find Gamebattle matches.

The app should work with any game, provided that you correctly input the parameters into the .env file.

The accepted parameters are:
 - username=
    ~ gamebattles login username e.g. BillyJunior69
 - password=
    ~ gamebattles login passord e.g. ilikechickens69
 - teamname
    ~ this is the ID of your team e.g. 32323232
 - mapCount 
    ~ e.g. 1, 3, 5
 - gameMode 
    ~ e.g. CWL Variant
 - levelPos 
    ~ e.g. Above, Equal, Below
 - roster 
    ~ e.g. MyAwesomeGamertag,TerriblePlayer123,Ilikecheese
 - waitTime
    ~ time in ms to wait before refreshing the page to search for a game e.g. 10000
 - devMode
    ~ If set to true, games will NOT be automatically accepted

=== Prerequisites ===

- Node v8 or above

=== To run ===

1. Open project with vscode
2. Run npm i
3. Run app and navigate to localhost:9999/findmatch