require('dotenv').config();
const PORT = process.env.PORT || 3001;
const express = require('express');
const json = require('body-parser/json');
const app = express();
const cors = require('cors');

// router import
const board_router = require('./board_router.js');

// cors
app.use(cors());
// parse body
app.use(json());
// routers
app.use('/board', board_router);

// server start
app.listen(PORT, (req, res, next) => {
    console.log(`Server listening on PORT: ${PORT}.`);
});