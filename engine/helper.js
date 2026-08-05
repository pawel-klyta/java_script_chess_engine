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

    const distance = ((pieceData['coords'][0] - pieceData['checksAt'][0])**2) * ((pieceData['coords'][1] - pieceData['checksAt'][1])**2);
    if (distance === 1) {
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
        console.log('triggered');
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

// helper functions for restrictKing()

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

//

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

module.exports = {  pieceSwitch,
                    pieceSwitchCheckPath, 
                    filterOutWhenChecked, 
                    filterOutSameColor, 
                    getOppositeColor,
                    restrictKing,
                    filterOutEmppty,
                    isDuplicate
                };
