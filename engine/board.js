const { pieceSwitch, 
        pieceSwitchCheckPath, 
        filterOutWhenChecked, 
        filterOutSameColor,
        getOppositeColor
    } = require("./helper.js");

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
        this.board = {
            '8':    {'1': 'bR','2': 'bN','3': 'bB','4': 'bQ','5': 'bQ','6': 'bB','7': 'bN','8': 'bR'},
            '7':    {'1': 'bP','2': 'bP','3': 'bP','4': 'bP','5': 'bP','6': 'bP','7': 'bP','8': 'bP'},
            '6':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '5':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '4':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '3':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '2':    {'1': 'wP','2': 'wP','3': 'wP','4': 'wP','5': false,'6': 'wP','7': 'wP','8': 'wP'},
            '1':    {'1': 'wR','2': 'wN','3': 'wB','4': 'wQ','5': 'wK','6': 'wB','7': 'wN','8': 'wR'}
        };

        this.whiteMaterial = 39;
        this.blackMaterial = 39;
        this.currentToMove = 'w';
        this.inCheck = false;
        this.coveredSquaresWhite = this.getCoveredSquares('w');
        this.coveredSquaresWhite = this.getCoveredSquares('b');
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
            const squareToCheck = this.board[y][x];
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
        const piece = this.board[y][x];
        const pieceColor = piece[0];
        const pieceType = piece[1];
        const oppositeColoredKing = getOppositeColor(pieceColor);
        const coveredSquares = pieceSwitch(x, y, this, pieceType, pieceColor);
        
        const toReturn = {
            'coords': [x, y], 
            'piece': piece,
            'coveredSquaresBySpecificPiece': coveredSquares,
            'checks': false
        }

        for (let i = 0; i < coveredSquares.length; i++) {
            if (coveredSquares[i][2] === oppositeColoredKing) {
                toReturn['checks'] = oppositeColoredKing;
                toReturn['checksAt'] = [coveredSquares[i][0], coveredSquares[i][1]];
                toReturn['checkPath'] = pieceSwitchCheckPath(toReturn);
                this.inCheck = toReturn;
                break;
            };
        };

        return toReturn
    }

    getCoveredSquares(pieceColor) { // returns an array of all pieces, which are in sight of all the pieces of one of the colors
        let currentPiece;
        let result = [];

        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                currentPiece = this.board[y][x];
                if (currentPiece[0] === pieceColor) {
                    result.push(this.getCoveredSquaresBySpecificPiece(x, y));
                };
            };
        };
        return result;
    } 

    updateBoard() {
        this.inCheck = false;
        this.coveredSquaresWhite = this.getCoveredSquares('w');
        this.coveredSquaresWhite = this.getCoveredSquares('b');
        return this.inCheck;
    }

    getLegalMovesOfSpecificPiece(x, y) {
        /*
            returns the legal moves in the current format
                [{
                    coords: [x, y], //the piece that holds the legal moves
                    piece: '${color}${type}',
                    legalMoves: [[x ,y, value of the square], ...] //all the squares in this format if no move is available this array will be empty
                }]
        */ 
        const piece = this.getCoveredSquaresBySpecificPiece(x, y);
        const oppositeColor = getOppositeColor(piece.piece[0]);

        // for testing
        //this.updateBoard();

        // for debugging
        if (this.inCheck) {
            if (this.inCheck.checks[0] !== this.currentToMove) {
                console.log('#########');
                console.log(`WARNING currently in check ${this.inCheck.checks}, although ${this.currentToMove} is expected to move`)
                console.log('#########');
            };
        };
        // for debugging 

        switch(piece.piece[1]) {
            case  'K':
                break;
            case  'P':
                break;
            default:
                piece.legal = filterOutSameColor(piece.coveredSquaresBySpecificPiece, piece.piece[0]);
                if (this.inCheck) {
                    piece.legal = filterOutWhenChecked(piece.legal, this.inCheck.checkPath);
                };
                return piece;
        };
    }
};

module.exports = {game};

// some tests

const test = new game();

//console.log(test.getLegalMovesOfSpecificPiece(1,8)); 

//sconsole.log(test.getCoveredSquaresBySpecificPiece(5,8));
//console.log(test.getCoveredSquaresBySpecificPiece(3,2));

//console.log(test.getCoveredSquaresBySpecificPiece(6,1));
console.log(test.getLegalMovesOfSpecificPiece(4,1));
//console.log(test.coveredSquaresWhite);
//console.log(test.getCoveredSquaresBySpecificPiece(4,1));
//console.log(test.getCoveredSquaresBySpecificPiece(3,1).coveredSquaresBySpecificPiece.length);

//console.log(test.getCoveredSquares('w')[8]);

// console.log(test.getCoveredSquares('w'));

//console.log(test.inCheck);