const {  pieceSwitch,
        pieceSwitchCheckPath, 
        filterOutWhenChecked, 
        filterOutSameColor, 
        getOppositeColor,
        restrictKing,
        filterOutEmppty,
        isDuplicate,
        getCastleMoves,
        updateEnPassantSquare,
        updateCurrentToMove,
        updateRightToCastle,
        getValue
    } = require("./helper.js");

class board {
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
            '8':    {'1': 'bR','2': 'bN','3': 'bB','4': 'bQ','5': 'bK','6': 'bB','7': 'bN','8': 'bR'},
            '7':    {'1': 'bP','2': 'bP','3': 'bP','4': 'bP','5': 'bP','6': 'bP','7': 'bP','8': 'bP'},
            '6':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '5':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '4':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '3':    {'1': false,'2': false,'3': false,'4': false,'5': false,'6': false,'7': false,'8': false},
            '2':    {'1': 'wP','2': 'wP','3': 'wP','4': 'wP','5': 'wP','6': 'wP','7': 'wP','8': 'wP'},
            '1':    {'1': 'wR','2': 'wN','3': 'wB','4': 'wQ','5': 'wK','6': 'wB','7': 'wN','8': 'wR'}
        };

        this.whiteMaterial = 39;
        this.blackMaterial = 39;
        this.currentToMove = 'w';
        this.inCheck = false;
        this.doubleCheck = false;
        this.enPassant = false;

        this.rightToCastleShortW = true;
        this.rightToCastleShortB = true;
        this.rightToCastleLongW = true;
        this.rightToCastleLongB = true;

        this.coveredSquaresWhite = this.getCoveredSquares('w');
        this.coveredSquaresBlack = this.getCoveredSquares('b');

        this.legalMovesWhite = this.getAllLegalMovesByColor('w');
        this.legalMovesBlack = [];
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
                checksAt: [x-coordinate, y-coordinate], of the king in check
                checkPath: [[x-coordinate, y-coordinate], array with the squares]
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
                if (this.inCheck) {
                    this.doubleCheck = true;
                };
                this.inCheck = toReturn;
                break;
            };
        };
        return toReturn
    }

    getCoveredSquares(pieceColor) { // returns an array of all pieces, which are in sight of all the pieces of one of the colors
        let currentPiece;
        let result = [];
        let newMaterialCount = 0;

        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                currentPiece = this.board[y][x];
                if (currentPiece[0] === pieceColor) {
                    result.push(this.getCoveredSquaresBySpecificPiece(x, y));
                    newMaterialCount += getValue(currentPiece[1]);
                };
            };
        };
        if (pieceColor === 'w') {
            this.whiteMaterial = newMaterialCount;
        } else {
            this.blackMaterial = newMaterialCount;
        };
        return result;
    } 

    updateBoard() {
        this.inCheck = false;
        this.doubleCheck = false;
        this.enPassant = false;
        this.coveredSquaresWhite = this.getCoveredSquares('w');
        this.coveredSquaresBlack = this.getCoveredSquares('b');
        return this.inCheck;
    }

    updateMoves() {
        if (this.currentToMove === 'w') {
            this.legalMovesWhite = this.getAllLegalMovesByColor('w');
            this.legalMovesBlack = [];
        } else {
            this.legalMovesWhite = [];
            this.legalMovesBlack = this.getAllLegalMovesByColor('b');
        };
    }

    getLegalMovesOfSpecificPiece(x, y) {
        /*  
            returns an element in the following schema
            {
                coords: [x-coordinate, y-coordinate] //of the given piece,
                piece: '${colorIndicator}${piecetypeIndicator}',
                legal: [
                    [ x-coordinate, y-coordinate, 'string of the given piece that has legal moves on the given squares with specified color of the looked at piece with [0] and [1] specifieng the type' ], // can be multiple squares
                    [ 4, 1, 'wQ' ]
                ]
            }
        */
        const piece = this.getCoveredSquaresBySpecificPiece(x, y);
        const oppositeColor = getOppositeColor(piece.piece[0]);

        piece.legal = filterOutSameColor(piece.coveredSquaresBySpecificPiece, piece.piece[0]);
        switch(piece.piece[1]) {
            case  'K':
                piece.legal.push(...getCastleMoves(this, piece.piece[0]));

                let coveredByOpposite = this.coveredSquaresBlack;
                if (oppositeColor[0] === 'w') {
                    coveredByOpposite = this.coveredSquaresWhite;
                };
                piece.legal = restrictKing(piece.legal, coveredByOpposite);
                break;
            case  'P':
                let enPassantSquare;
                if (this.doubleCheck) {
                    piece.legal = [];
                } else {
                    if (this.enPassant) {
                        if (isDuplicate(piece.legal, this.enPassant)) {
                            if ((this.enPassant[1] === 3 && piece.piece[0] === 'b') || (this.enPassant[1] === 6 && piece.piece[0] === 'w')) {
                                enPassantSquare = this.enPassant;
                            };                        
                        };
                    };
                    piece.legal = filterOutEmppty(piece.legal);
                    if (piece.piece[0] === 'w') {
                        if (this.board[y + 1][x] === false) {
                            if (y === 7) {
                                piece.legal.push([x, y + 1, false, `${piece.piece[0]}Q`]);
                                piece.legal.push([x, y + 1, false, `${piece.piece[0]}R`]);
                                piece.legal.push([x, y + 1, false, `${piece.piece[0]}B`]);
                                piece.legal.push([x, y + 1, false, `${piece.piece[0]}N`]);
                            } else {
                                piece.legal.push([x, y + 1, false]);
                            };
                            if (y === 2 && this.board[y + 2][x] === false) {
                                piece.legal.push([x, y + 2, false]);
                            };
                        };
                    } else { 
                        if (this.board[y - 1][x] === false) {
                            if (y === 2) {
                                piece.legal.push([x, y - 1, false, `${piece.piece[0]}Q`]);
                                piece.legal.push([x, y - 1, false, `${piece.piece[0]}R`]);
                                piece.legal.push([x, y - 1, false, `${piece.piece[0]}B`]);
                                piece.legal.push([x, y - 1, false, `${piece.piece[0]}N`]);
                            } else {
                                piece.legal.push([x, y - 1, false]);
                            };
                            if (y === 7 && this.board[y - 2][x] === false) {
                                piece.legal.push([x, y - 2, false]);
                            };
                        };
                    };
                }
                if (this.inCheck) {
                    piece.legal = filterOutWhenChecked(piece.legal, this.inCheck.checkPath);
                };
                if (enPassantSquare) {
                    piece.legal.push(enPassantSquare);
                };
                break;
            default:
                if (this.doubleCheck) {
                    piece.legal = [];
                } else if (this.inCheck) {
                    piece.legal = filterOutWhenChecked(piece.legal, this.inCheck.checkPath);
                };
                break;
        };
        delete(piece.coveredSquaresBySpecificPiece);
        delete(piece.checks);
        delete(piece.checkPath);
        delete(piece.checksAt);
        this.validateAllLegalMovesOfGivenPiece(piece);
        return piece;
    }

    makeMoveSoft(move) { 
        /* expects an object in this format:
            { 
                coords: [x, y], //from the piece that will be moved
                piece: '${color}${type}', of the piece that will be moved
                move: [x, y, '${color}${type}'] an array conatining the destination square and the piece which is standing there
            } 
        */
        if (move.move.length === 4) {
            this.board[move.coords[1]][move.coords[0]] = false;
            this.board[move.move[1]][move.move[0]] = move.move[3];
        } else if (move.move[2] === 'castle') {
            let yCoordCastle = 8;
            if (move.piece[0] === 'w') {
                yCoordCastle = 1;
            };
            let add = 1;
            if (move.move[3] === 'long') {
                add = -1;
                this.board[yCoordCastle][1] = false;
            } else {
                this.board[yCoordCastle][8] = false;
            };
            this.board[move.coords[1]][move.coords[0]] = false;
            this.board[move.coords[1]][move.coords[0] + add] = `${move.piece[0]}R`;
            this.board[move.move[1]][move.move[0]] = move.piece;
        } else {
            this.board[move.coords[1]][move.coords[0]] = false;
            this.board[move.move[1]][move.move[0]] = move.piece;
        };
    }

    simulateMove(move) { // return true if move was legal, and false if not
        const previous = this.inCheck;
        const oppositeColor = getOppositeColor(move.piece[0])[0];

        this.inCheck = false;
        this.makeMoveSoft(move);
        this.getCoveredSquares(oppositeColor);

        let test;
        if (this.inCheck) {
            test = this.inCheck.checks[0] === move.piece[0];
        }
        if (move.move[2] === 'castle') {
            console.log('proplem');
            console.log(move)
            let yCoordCastle = 8;
            if (move.piece[0] === 'w') {
                yCoordCastle = 1;
            };
            let add = 1;
            if (move.move[3] === 'long') {
                this.board[yCoordCastle][1] = `${move.piece[0]}R`;
                add = -1;
            } else {
                this.board[yCoordCastle][8] = `${move.piece[0]}R`;
            };
            this.board[move.coords[1]][move.coords[0]] = move.piece;
            this.board[move.coords[1]][move.coords[0] + add] = false;
            this.board[move.move[1]][move.move[0]] = false;
        } else if (move.move[2] === 'enPassant') {
            return;
        } else {
            this.board[move.coords[1]][move.coords[0]] = move.piece;
            this.board[move.move[1]][move.move[0]] = move.move[2];
        };
        this.inCheck = previous;

        if (test) {
            return false;
        };
        return true;
    }

    validateAllLegalMovesOfGivenPiece(piece) {
        /* expects an object in this format:
            { 
                coords: [x, y], //from the piece that will be moved
                piece: '${color}${type}', of the piece that will be moved
                legal: [[x, y, '${color}${type}'], [x, y, false]] an array conatining the destination square and the piece which is standing there, multiple legal moves
            } 
        */
        const newLegal = [];
        for (let i = 0; i < piece.legal.length; i++) {
            if (this.simulateMove({
                    coords: piece.coords,
                    piece: piece.piece,
                    move: piece.legal[i]
            })) {
                newLegal.push(piece.legal[i]);
            };
        };
        piece.legal = newLegal;
    }

    getAllLegalMovesByColor(pieceColor) {
        let currentPiece;
        let result = [];

        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                currentPiece = this.board[y][x];
                if (currentPiece[0] === pieceColor) {
                    result.push(this.getLegalMovesOfSpecificPiece(x, y));
                };
            };
        };
        return result;
    } 

    makeMove(move) { // passed in move has to be valid
        this.makeMoveSoft(move);
        updateCurrentToMove(this, move);
        this.updateBoard();
        updateRightToCastle(this, move);
        updateEnPassantSquare(this, move);
        this.updateMoves();
    }
};

module.exports = { board };
