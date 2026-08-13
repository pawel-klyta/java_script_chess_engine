const getOppositeColor = (pieceColor) => {
    if (pieceColor === 'w') {
        return 'bK';
    } else {
        return 'wK';
    };
};

const pieceSwitch = (x, y, This, pieceType, pieceColor) => {
    const coveredSquares = [];

    let up = [];
    let down = [];
    let left = [];
    let right = [];

    let leftUp = [];
    let rightUp = [];
    let leftDown = [];
    let rightDown = [];
    switch(pieceType) {
        case  'K':
            up = [[x, y + 1]];
            down = [[x, y - 1]];
            left = [[x - 1, y]];
            right = [[x + 1, y]];

            leftUp = [[x - 1, y + 1]];
            rightUp = [[x + 1, y + 1]];
            leftDown = [[x - 1, y - 1]];
            rightDown = [[x + 1, y - 1]];

            coveredSquares.push(...This.checkSquares(up, pieceColor));
            coveredSquares.push(...This.checkSquares(down, pieceColor));
            coveredSquares.push(...This.checkSquares(left, pieceColor));
            coveredSquares.push(...This.checkSquares(right, pieceColor));

            coveredSquares.push(...This.checkSquares(leftUp, pieceColor));
            coveredSquares.push(...This.checkSquares(rightUp, pieceColor));
            coveredSquares.push(...This.checkSquares(leftDown, pieceColor));
            coveredSquares.push(...This.checkSquares(rightDown, pieceColor));
            break;
        case  'Q':
            for (let i = 1; i <= 8; i++) {
                up.push([x, y + i]);
                down.push([x, y - i]);
                left.push([x - i, y]);
                right.push([x + i, y]);

                leftUp.push([x - i, y + i]);
                rightUp.push([x + i, y + i]);
                leftDown.push([x - i, y - i]);
                rightDown.push([x + i, y - i]);
            };
            coveredSquares.push(...This.checkSquares(up, pieceColor));
            coveredSquares.push(...This.checkSquares(down, pieceColor));
            coveredSquares.push(...This.checkSquares(left, pieceColor));
            coveredSquares.push(...This.checkSquares(right, pieceColor));

            coveredSquares.push(...This.checkSquares(leftUp, pieceColor));
            coveredSquares.push(...This.checkSquares(rightUp, pieceColor));
            coveredSquares.push(...This.checkSquares(leftDown, pieceColor));
            coveredSquares.push(...This.checkSquares(rightDown, pieceColor));
            break;
        case  'R':
            for (let i = 1; i <= 8; i++) {
                up.push([x, y + i]);
                down.push([x, y - i]);
                left.push([x - i, y]);
                right.push([x + i, y]);
            };
            coveredSquares.push(...This.checkSquares(up, pieceColor));
            coveredSquares.push(...This.checkSquares(down, pieceColor));
            coveredSquares.push(...This.checkSquares(left, pieceColor));
            coveredSquares.push(...This.checkSquares(right, pieceColor));
            break;
        case 'B': // Bishop
            for (let i = 1; i <= 8; i++) {
                leftUp.push([x - i, y + i]);
                rightUp.push([x + i, y + i]);
                leftDown.push([x - i, y - i]);
                rightDown.push([x + i, y - i]);
            };
            coveredSquares.push(...This.checkSquares(leftUp, pieceColor));
            coveredSquares.push(...This.checkSquares(rightUp, pieceColor));
            coveredSquares.push(...This.checkSquares(leftDown, pieceColor));
            coveredSquares.push(...This.checkSquares(rightDown, pieceColor));
            break;
        case 'N': // Knight: needs refeactoring to meet structure above: define array
            coveredSquares.push(...This.checkSquares([[x + 2, y + 1]],pieceColor));
            coveredSquares.push(...This.checkSquares([[x + 2, y - 1]],pieceColor));
            coveredSquares.push(...This.checkSquares([[x - 2, y + 1]],pieceColor));
            coveredSquares.push(...This.checkSquares([[x - 2, y - 1]],pieceColor));

            coveredSquares.push(...This.checkSquares([[x + 1, y + 2]],pieceColor));
            coveredSquares.push(...This.checkSquares([[x + 1, y - 2]],pieceColor));
            coveredSquares.push(...This.checkSquares([[x - 1, y + 2]],pieceColor));
            coveredSquares.push(...This.checkSquares([[x - 1, y - 2]],pieceColor));
            break;
        case 'P': // Pawn: needs refeactoring to meet structure above: define array + en passant
            let add = -1;
            if (pieceColor === 'w') { // depands on the color where to move
                add = 1;
            }

            coveredSquares.push(...This.checkSquares([[x - 1, y + add]],pieceColor));
            coveredSquares.push(...This.checkSquares([[x + 1, y + add]],pieceColor));
            break;
    };
    return coveredSquares;
};

const pieceSwitchCheckPath = (pieceData) => {
    const checkPath = [pieceData['coords']]; // are the squares which can brake the check by either blocking or capturing the piece
    const coveredSquares = pieceData.coveredSquaresBySpecificPiece;
    const oppositeColoredKing = getOppositeColor(pieceData['piece'][0]); 

    const diffSqrY = (pieceData['coords'][1] - pieceData['checksAt'][1])**2;
    const diffSqrX = (pieceData['coords'][0] - pieceData['checksAt'][0])**2;
    const distance1 = (() => {
        if (((diffSqrY === 0 || diffSqrX === 0) && (diffSqrY === 1 || diffSqrX === 1)) || (diffSqrY === 1 && diffSqrX === 1)) {
            return true;
        } else {
            return false;
        };
    })();

    if (distance1) {
        return checkPath;
    }; // checks if checking piece is only one square away

    switch (pieceData['piece'][1]) {
        case 'N': // Knight only allows to brake the check if captured or opponent king moves
            return checkPath;
        case 'P': // Pawn only allows to brake the check if captured or opponent king moves, en-passant maybe needs some update to this logic
            return checkPath;

        default: // Q, R and B are included in this logic
            for (let i = 0; i < coveredSquares.length; i++) {
                if (coveredSquares[i][2] === oppositeColoredKing) {
                    let inPath = [coveredSquares[i - 1][0], coveredSquares[i - 1][1]];
                    let xDelta = pieceData['checksAt'][0] - inPath[0];
                    let yDelta = pieceData['checksAt'][1] - inPath[1];
                    while (inPath[0] !== pieceData['coords'][0] || inPath[1] !== pieceData['coords'][1]) {
                        checkPath.push([...inPath]);
                        inPath[0] -= xDelta;
                        inPath[1] -= yDelta;
                    };
                    return checkPath;
                };
            };
            return checkPath;
            // King cant give checks
    }
};

const filterOutWhenChecked = (squareArray, checkPath) => {
    const result = [];
    for (let indexSquareArray = 0; indexSquareArray < squareArray.length; indexSquareArray++) {
        for (let indexCheckpath = 0; indexCheckpath < checkPath.length; indexCheckpath++) {
            if ( squareArray[indexSquareArray][0] === checkPath[indexCheckpath][0] &&
                 squareArray[indexSquareArray][1] === checkPath[indexCheckpath][1] ) {
                    result.push([...squareArray[indexSquareArray]]);
            };
        };
    };
    return result;
};

const filterOutSameColor = (squareArray, pieceColor) => {
    const result = [];
    for (let indexSquareArray = 0; indexSquareArray < squareArray.length; indexSquareArray++) {
        if (squareArray[indexSquareArray][2][0] !== pieceColor) {
            result.push([...squareArray[indexSquareArray]]);
        };
    };
    return result;
};

const filterOutEmppty = (squareArray) => {
    if (squareArray.length === 0) {
        return squareArray;
    };
    const result = [];
    for (let indexSquareArray = 0; indexSquareArray < squareArray.length; indexSquareArray++) {
        if (squareArray[indexSquareArray][2] !== false) {
            result.push([...squareArray[indexSquareArray]]);
        };
    };
    return result;
};

const isDuplicate = (array, valueToAdd) => {
    for (let i = 0; i < array.length; i++) {
        if (
            array[i][0] === valueToAdd[0] &&
            array[i][1] === valueToAdd[1]
        ) {
            return true
        };
    };
    return false;
};

const checkCastleMoves = (array) => {
    const result = [];
    let add;
    for (let i = 0; i < array.length; i++) {
        if (array[i][2] === 'castle') {
            add = 1;
            if (array[i][3] === 'short') {
                add = -1;
            };
            for (let j = 0; j < array.length; j++) {
                if ((array[i][0] + add === array[j][0]) && (array[i][1] === array[j][1])) {
                    result.push(array[i]);
                };
            };
        } else {
            result.push(array[i]);
        };
    };
    return result;
};

const intoArray = (coveredByOppositeElements) => {
    const result = [];
    for (let i = 0; i < coveredByOppositeElements.length; i++) {
        for (let index = 0; index < coveredByOppositeElements[i].coveredSquaresBySpecificPiece.length; index++) {
            if (!isDuplicate(result, coveredByOppositeElements[i].coveredSquaresBySpecificPiece[index])) {
                result.push(coveredByOppositeElements[i].coveredSquaresBySpecificPiece[index]);
            };
        };
    };
    return result;
};

const restrictKing = (squareArray, coveredByOpposite) => {
    const result = [];
    coveredByOpposite = intoArray(coveredByOpposite);
    for (let indexSquareArray = 0; indexSquareArray < squareArray.length; indexSquareArray++) {
        for (let indexcoveredByOpposite = 0; indexcoveredByOpposite < coveredByOpposite.length; indexcoveredByOpposite++) {
            if ( !isDuplicate(coveredByOpposite, squareArray[indexSquareArray])) {
                    if (!isDuplicate(result, [...squareArray[indexSquareArray]])) {
                        result.push([...squareArray[indexSquareArray]]);
                    };
            };
        };
    };
    return result;
};

const getCastleMoves = (This, color) => {
    const result = [];
    if (color === 'w') {
        if ((This.rightToCastleShortW === true) && (This.board[1][6] === false) && (This.board[1][7]) === false) {
            result.push([7, 1, 'castle', 'short']);
        };
        if (This.rightToCastleLongW === true && This.board[1][4] === false && This.board[1][3] === false && This.board[1][2] === false) {
            result.push([3, 1, 'castle', 'long']);
        };
    } else {
        if (This.rightToCastleShortB === true && This.board[8][6] === false && This.board[8][7] === false) {
            result.push([7, 8, 'castle', 'short']);
        };
        if (This.rightToCastleLongB === true && This.board[8][4] === false && This.board[8][3] === false && This.board[8][2] === false) {
            result.push([3, 8, 'castle', 'long']);
        };
    }
    return result;
}; 

const updateEnPassantSquare = (This, move) => {
    let yCoordEnPassant = 3;
    let yDifference = -2;
    if (move.piece[0] === 'b') {
        yCoordEnPassant = 6;
        yDifference = 2;
    };
    if (move.piece[1] === 'P' && (move.coords[1] - move.move[1]) === yDifference ) {
        This.enPassant = [move.coords[0], yCoordEnPassant, 'enPassant'];
    };
};
    
const updateCurrentToMove = (This, move) => {
    if (This.currentToMove === 'w') {
        This.currentToMove = 'b';
    } else {
        This.currentToMove = 'w';
    }
};

const updateRightToCastle = (This, move) => {
    if (move.piece[0] === 'w') {
            if (move.piece[1] === 'K' || (move.coords[0] === 1 && move.coords[1] === 1)) {
                This.rightToCastleLongW = false;
            };
            if (move.piece[1] === 'K' || (move.coords[0] === 8 && move.coords[1] === 1)) {
                This.rightToCastleShortW = false;
            };
        } else {
            if (move.piece[1] === 'K' || (move.coords[0] === 1 && move.coords[1] === 8)) {
                This.rightToCastleLongB = false;
            };
            if (move.piece[1] === 'K' || (move.coords[0] === 8 && move.coords[1] === 8)) {
                This.rightToCastleShortB = false;
            };
        };
};

const getValue = (pieceType) => {
    switch (pieceType) {
        case 'Q': return 9;
        case 'R': return 5;
        case 'B': return 3.1;
        case 'N': return 3;
        case 'P': return 1;
        case 'K': return 0;
    };
};

module.exports = {  pieceSwitch,
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
                    getValue,
                    checkCastleMoves
                };
