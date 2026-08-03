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
            '7':    {'1': 'bP','2': 'bP','3': 'bP','4': 'bP','5': false,'6': 'bP','7': 'bP','8': 'bP'},
            '6':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '5':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '4':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '3':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '2':    {'1': 'wP','2': 'wP','3': 'wP','4': 'wP','5': false,'6': 'wP','7': 'wP','8': 'wP'},
            '1':    {'1': 'wR','2': 'wN','3': 'wB','4': 'wK','5': 'wQ','6': 'wB','7': 'wN','8': 'wR'}
        };

        this._whiteMaterial = 39;
        this._blackMaterial = 39;
        this._currentToMove = 'white';
        this.inCheck = false;
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
                coords: [x-coordinate, y-coordinate] //of the given piece,
                piece: '${colorIndicator}${piecetypeIndicator}',
                coveredSquaresBySpecificPiece: [
                    [ x-coordinate, y-coordinate, 'string of piece the given piece has in sight with specified color of the looked at piece with [0] and [1] specifieng the type' ], // can be multiple squares
                    [ 4, 1, 'wQ' ]
                ]
                checks: '${string which indicates the king the piece checks}' or false if no king in check,
                checksAt: [x-coordinate, y-coordinate] of the king in check
            }
        */
        const piece = this._board[y][x];
        const pieceColor = piece[0];
        const oppositeColoredKing = (()=>{if (pieceColor === 'w') {return 'bK'} else {return 'wK'};})(); 
        const pieceType = piece[1]; // getting the second letter of the string to identify the piece
        const coveredSquares = pieceSwitch(x, y, this, pieceType, pieceColor);

        let checks = false;
        let checksAt = false;
        
        for (let i = 0; i < coveredSquares.length; i++) {
            if (coveredSquares[i][2] === oppositeColoredKing) {
                checks = oppositeColoredKing;
                checksAt = [coveredSquares[i][0], coveredSquares[i][1]];
                break;
            };
        };

        return {'coords': [x, y], 
                'piece': piece,
                'coveredSquaresBySpecificPiece': coveredSquares,
                'checks': checks,
                'checksAt': checksAt
        };
    }

    getCoveredSquares(pieceColor) { // returns the number of the total squares, which are in sight of all the pieces of one of the colors
        let currentPiece;
        let result = [];

        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                currentPiece = this._board[y][x];
                if (currentPiece[0] === pieceColor) {
                    result.push(this.getCoveredSquaresBySpecificPiece(x, y));
                };
            };
        };
        return result;
    } 

    isInCheck() {
        const whiteCoveredSquares = this.getCoveredSquares('w');
        const blackCoveredSquares = this.getCoveredSquares('b');
        
        for (let i = 0; i < whiteCoveredSquares.length; i++) {
            if (whiteCoveredSquares[i]['checks'] === 'bK') {
                //return {
                //    x: whiteCoveredSquares[i]['x'],
                //};
                return whiteCoveredSquares[i];
            };
        };
        for (let i = 0; i < blackCoveredSquares.length; i++) {
            if (blackCoveredSquares[i]['checks'] === 'wK') {
                return whiteCoveredSquares[i];
            };
        };
        return false;
    }

    getLegalMovesOfSpecificPiece(x, y) {
        const piece = this._board[y][x]; 
        const pieceColor = piece[0];
        const pieceType = piece[1];
        const legal = [];

        this.isInCheck();

        switch(pieceType) {
            case  'K':
                break;
            case  'Q':
                break;
            case  'R':
                break;
            case  'B':
                break;
            case  'N':
                break;
            case  'P':
                break;
        }

        return piece;
    }
};

module.exports = {game};

// some tests

const test = new game();

//console.log(test.getLegalMovesOfSpecificPiece(1,8)); 

console.log(test.getCoveredSquaresBySpecificPiece(5,1));
//console.log(test.getCoveredSquaresBySpecificPiece(3,1).coveredSquaresBySpecificPiece.length);

//console.log(test.getCoveredSquares('w')[8]);

// console.log(test.getCoveredSquares('w'));

//console.log(test.isInCheck());