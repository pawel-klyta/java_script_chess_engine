
const {
    game
} = require('./game.js')

const moveListPars = (original) => {
    const parsed = [];

    for (let i = 0; i < original.length; i++) {
        for (let y = 0; y < original[i].legal.length; y++) {
            parsed.push({ coords: original[i].coords, piece: original[i].piece, move: original[i].legal[y]});
        }
    }

    return parsed;
};

const randomMove = (moveArray) => {
    const index = Math.floor(Math.random() * moveArray.length);
    return moveArray[index];
};

const makeCpuMove = async (color) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    let possibleMovesList = game.legalMovesWhite;
    if (color === 'b') {
        possibleMovesList = game.legalMovesBlack;
    };

    const nextMove = randomMove(moveListPars(possibleMovesList));

    game.makeMove(nextMove);
};

module.exports = { makeCpuMove };