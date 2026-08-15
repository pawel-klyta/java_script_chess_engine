const { getOppositeColor } = require("./pieceSwitch.js");

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

module.exports = {  
    filterOutWhenChecked, 
    filterOutSameColor,
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
