const express = require('express');
const board_router = express.Router();
const { game } = require('./game.js');

board_router.get('/' ,(req, res, next) => {
    res.status(200).send(game.board);
});

module.exports = board_router;