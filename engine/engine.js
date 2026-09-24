
const {
    game
} = require('./game.js')

const randomMove = (moveArray) => {
    const index = Math.floor(Math.random() * moveArray.length);
    return moveArray[index];
};

const makeCpuMove = (color) => {
    (async () => {
        console.log("Start der IIFE...");

        // Die Pause (10 Sekunden) verpackt in ein Promise
        await new Promise(resolve => setTimeout(resolve, 10000));

        let possibleMovesList = game.legalMovesWhite;
        if (color === 'b') {
            possibleMovesList = game.legalMovesBlack;
        };

        console.log(possibleMovesList);

        const nextMove = randomMove(possibleMovesList);

        game.makeMove(nextMove);

    })();
};

module.exports = { makeCpuMove };