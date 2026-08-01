class game {
    constructor() {
        /*
            w => white, b => black

            K => King
            Q => Queen
            R => Rook
            B => Bishop
            N => Knight
            P => Pawn

            for example:    wK => white King
                            bQ => black Queen

            letter = row
            number = column
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
            if (squareToCheck !== false) {
                if (squareToCheck[0] === pieceColor) {
                return result;
                };
            };
            result.push([x, y]);
        };
        return result;
    }

    getCoveredSquaresBySpecificPiece(x, y) {
        const piece = this._board[y][x]; //needs to be stringified or some form of check
        const pieceColor = piece[0];
        const pieceType = piece[1]; // getting the second letter of the string to identify the piece
        const coveredSquares = [];

        switch(pieceType) {
            case 'P': // Pawn attacks two squares
                let add = -1;
                if (pieceColor === 'w') { // depands on the color where to move
                    add = 1;
                }

                coveredSquares.push(...this.checkSquares([[x - 1, y + add]],pieceColor));
                coveredSquares.push(...this.checkSquares([[x + 1, y + add]],pieceColor));
                break;
        };

        return {'pieceColor': pieceColor, 'pieceType': pieceType, 'coveredSquaresBySpecificPiece': coveredSquares};
    }

    getLegalMovesOfSpecificPiece(coordLetter, coordNumber) {
        const piece = this._board[coordNumber][coordLetter]; //needs to be stringified or some form of check
        const pieceType = piece[1]; // getting the second letter of the string to identify the piece

        const legal = [];
        return piece;
    }
};

const test = new game();
//console.log(test.getLegalMovesOfSpecificPiece(1,8));

console.log(test.getCoveredSquaresBySpecificPiece(4,2));