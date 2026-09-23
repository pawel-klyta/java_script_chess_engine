const express = require('express');
const board_router = express.Router();

const { 
    game,
    listMovesOfSpecificPiece,
    makeMove
 } = require('./game.js');

 const {
    makeCpuMove
 } = require('./engine.js')

 board_router.param('x', (req, res, next, x) => {
    const xNumber = x.charCodeAt(0) - 96;
    if ( xNumber >= 1 && xNumber <= 8 ) {
        req.x = xNumber;
        next();
    } else {
        return res.status(404).send("this square doesn't exist.");
    }
});

board_router.param('y', (req, res, next, y) => {
    if ( y >= 1 && y <= 8 ) {
        req.y = parseInt(y);
        next();
    } else {
        return res.status(404).send("this square doesn't exist.");
    };
    
});

board_router.param('color', (req, res, next, color) => {
    if (color === 'w' || color === 'b') {
        req.color = color;
        next();
    } else {
        return res.status(404).send("this color doesn't exist.");
    }
});

board_router.get('/' ,(req, res, next) => {
    res.status(200).send({ board: game.board, endOfGame: game.endOfGame });
});

board_router.get('/cpumove/:color', (req, res, next) => {
    makeCpuMove(req.color);
    res.status(200).send({ board: game.board, endOfGame: game.endOfGame });
});

board_router.get('/:x/:y' ,(req, res, next) => {
    const toSend = listMovesOfSpecificPiece(req.x, req.y);
    if (!toSend) {
        res.status(404).send("there is no piece on the given square.")
    } else {
        res.status(200).send(toSend);
    };
});

board_router.post('/new', (req, res, next) => {
    game.newGame();
    res.status(200).send("board was reset");
});

board_router.post('/move', (req, res, next) => {
    const wasMoveValid = makeMove(req.body);
    if (wasMoveValid) {
        res.status(200).send();
    } else {
        res.status(404).send("invalid move");
    };
}); 

module.exports = board_router;