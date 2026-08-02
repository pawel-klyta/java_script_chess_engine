const piece_switch = (x, y, This, pieceType, pieceColor) => {
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
            up = [x, y + 1];
            down = [x, y - 1];
            left = [x - 1, y];
            right = [x + 1, y];

            leftUp = [x - 1, y + 1];
            rightUp = [x + 1, y + 1];
            leftDown = [x - 1, y - 1];
            rightDown = [x + 1, y - 1];

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

module.exports = {piece_switch};