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


// serve static
app.use(express.static('../frontend'))

// routers
app.use('/board', board_router);

// error handling
app.use((err, req, res, next) => {
    res.status(500).send(err.message);
});

// server start
app.listen(PORT, (req, res, next) => {
    console.log(`Server listening on PORT: ${PORT}.`);
});