const express = require('express');
const { board } = require('./board/board');
const board_router = express.Router();

board_router.get('/' ,(req, res, next) => {
    res.status(200).send('mounted corectly');
});

module.exports = board_router;