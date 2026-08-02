const { pieceSwitch } = require("./pieceSwitch");

class game {
    constructor() {
        /*
            false => free square

            w => white, b => black

            K => King
            Q => Queen
            R => Rook
            B => Bishop
            N => Knight
            P => Pawn

            for example:    wK => white King
                            bQ => black Queen
        */
        this._board = {
            '8':    {'1': 'bR','2': 'bN','3': 'bB','4': 'bQ','5': 'bK','6': 'bB','7': 'bN','8': 'bR'},
            '7':    {'1': 'bP','2': 'bP','3': 'bP','4': 'bP','5': 'bP','6': 'bP','7': 'bP','8': 'bP'},
            '6':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '5':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '4':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '3':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '2':    {'1': 'wP','2': 'wP','3': 'wP','4': 'wP','5': 'wP','6': 'wP','7': 'wP','8': 'wP'},
            '1':    {'1': 'wR','2': 'wN','3': 'wB','4': 'wQ','5': 'wK','6': 'wB','7': 'wN','8': 'wR'}
        };

        this._whiteMaterial = 39;
        this._blackMaterial = 39;
        this._currentToMove = 'white';
        this._inCheck = false;
    }

    static intoNumeric(letter) {
        return letter.charCodeAt(0) - 96;
    }

    static intoLetter(number) {
        return String.fromCharCode(number + 96);
    }

    checkSquares(square, pieceColor) {
        const result = [];
        for (let i = 0; i < square.length; i++) {
            const x = square[i][0]; 
            const y = square[i][1];

            if (x < 1 || x > 8 || y < 1 || y > 8) {
                return result;
            };
            const squareToCheck = this._board[y][x];
            if (squareToCheck !== false && (squareToCheck[0] === 'w' || squareToCheck[0] === 'b')) {
                result.push([x, y, squareToCheck]);
                return result;
            };
            result.push([x, y, false]);
        };
        return result;
    }

    getCoveredSquaresBySpecificPiece(x, y) { 
        /*  
            returns an element in the following schema
            {
                pieceColor: 'w', // the color of the given piece
                pieceType: 'K', // type of the given piece
                coveredSquaresBySpecificPiece: [
                    [ x-coordinate, y-coordinate, 'string of piece the given piece has in sight with specified color of the looked at piece with [0] and [1] specifieng the type' ], // can be multiple squares
                    [ 4, 1, 'wQ' ]
                ]
            }
        */
        const piece = this._board[y][x];
        const pieceColor = piece[0];
        const pieceType = piece[1]; // getting the second letter of the string to identify the piece
        const coveredSquares = pieceSwitch(x, y, this, pieceType, pieceColor);

        return {'pieceColor': pieceColor, 'pieceType': pieceType, 'coveredSquaresBySpecificPiece': coveredSquares};
    }

    getCoveredSquares(pieceColor) { // returns the number of the total squares, which are in sight of all the pieces of one of the colors
        let currentPiece;
        let result = 0;

        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                currentPiece = this._board[y][x];
                if (currentPiece[0] === pieceColor) {
                    result += this.getCoveredSquaresBySpecificPiece(x, y).coveredSquaresBySpecificPiece.length;
                };
            };
        };
        return result;
    } 

    getLegalMovesOfSpecificPiece(coordLetter, coordNumber) {
        const piece = this._board[coordNumber][coordLetter]; 
        const pieceType = piece[1]; // getting the second letter of the string to identify the piece

        const legal = [];
        return piece;
    }
};

module.exports = {game};

// some tests

const test = new game();

//console.log(test.getLegalMovesOfSpecificPiece(1,8)); 

console.log(test.getCoveredSquaresBySpecificPiece(5,1));
console.log(test.getCoveredSquaresBySpecificPiece(5,1).coveredSquaresBySpecificPiece.length);

console.log(test.getCoveredSquares('w'));