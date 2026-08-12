const { board } = require('./board/board.js');

const listMovesOfSpecificPiece = (x, y) => {
    if (game.board[y][x] === false) {
        return false;
    };
    if (game.board[y][x][0] === 'w') {
        for (let index = 0; index < game.legalMovesWhite.length; index++) {
            if (game.legalMovesWhite[index]['coords'][0] === x && game.legalMovesWhite[index]['coords'][1] === y) {
                return game.legalMovesWhite[index]['legal'];
            };
        };
    } else {
        for (let index = 0; index < game.legalMovesBlack.length; index++) {
            if (game.legalMovesBlack[index]['coords'][0] === x && game.legalMovesBlack[index]['coords'][1] === y) {
                return game.legalMovesBlack[index]['legal']
            };
        };
    };
    return [];
};

const validate = (move) => {
    if (move['coords'][1] >= 1 && move['coords'][1] <= 8 && move['coords'][0] >= 1 && move['coords'][0] <= 8) {
        if (move['move'][1] >= 1 && move['move'][1] <= 8 && move['move'][0] >= 1 && move['move'][0] <= 8) {
            if (move['piece'] === game.board[move['coords'][1]][move['coords'][0]]) {
                return true;
            };
        };
    };
    return false;
};

const makeMove = (move) => {
    if (validate(move)) {
        game.makeMove(move);
        return true;
    };
    return false;
};

const game = new board;

module.exports = { 
    game,
    listMovesOfSpecificPiece,
    makeMove
 };


