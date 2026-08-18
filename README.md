# Chess Engine (JavaScript)
## Goal Of This Project
My goal is to build a fully functional Chess engine in JavaScript utilizing REST-Api, with a separated front- and backend.

## Current State
### Backend

+ detection of all legal moves, including edge cases like:
    + king is in check (allowing only to capture the checking piece, blocking it or escaping the check by moving the king)
    + king is in double check (only the king is allowed to move)
    + pinned piece (is not allowed to move if the move results in the own king being exposed to a check)
    + castling (is only allowed if the right to castle was maintained and if the path to the castling square is not covered by an enemy piece)
    + en-passant
    + promotion of a pawn
+ sending the requested data to the frontend through [API routes](#available-api-routes)

### Frontend 

+ graphically simple
+ updates the board after receiving the current state of the board from the backend
+ shows a play again button if the game ended, by a win for white or black or a draw and displays the reason why the game ended
+ highlights every legal move, when a piece was clicked
+ Sends the move to the backend if a highlighted square was clicked on

## How To Start?

+ use this command to download the project: ``` git clone https://github.com/pawel-klyta/java_script_chess_engine.git ```
+ change directory into ``` ./engine ```
+ use this command to install the dependencies: ``` npm install ```
+ optional: specify a PORT in the .env file
+ use this command to start the backend and serve the frontend: ``` node app.js ``` both on PORT 3001, unless it was overwritten by the .env file

## Expected Features In The Future
### Frontend
+ flipping the board
+ choosing to play a local human vs human or human vs engine
+ choosing the strength of the engine

### Backend
+ engine with multiple strengths 
+ a function 
+ a function to evaluate the current position, taking account of various variables like:
    + checkmates
    + material
    + king safety
    + active pieces
    + checks
    + captures
    + threats
    + space 
    + shifting the importance of these variables, depending on stages of the game, for example:
        + opening: active pieces are very important
        + middle game: king safety is very important
        + end game: king activity is more important than the kings safety
+ a function to determine if a position is unsteady (to evaluate at a low cost of compute if further simulations of lines is required)

## Available API routes

### GET Routes

+ ./board           sends an object with this schema: ``` { board: game.board, endOfGame: game.endOfGame } ```, (``` endOfGame ``` can either be ``` "winW" ```, ``` "draw" ``` or ``` "winB" ```) 

+ ./board/:x/:y     sends an array with this schema: ``` [
                        [ x-coordinate, y-coordinate, pieceString], 
                        [ 4, 1, 'wQ' ]
                    ] ```

This route is used to get all legal moves of a specific piece

### POST Routes

+ ./board/new       resets the board to the starting position, sends the status 200 when the reset was successful

+ ./board/move      expects an object in the request body in the following schema: ``` { 
                coords: [x, y], from the piece that will be moved
                piece: '${color}${type}', of the piece that will be moved
                move: [x, y, '${color}${type}'] an array containing the destination square and the piece which is standing there
            } ```

the move will be played on the board and it sends the status ``` 200 OK ``` when it was successful