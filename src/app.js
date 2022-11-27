const express = require('express');
const recordsRouter = require('./routes/recordsRoutes.js');
const globalErrorHandler = require('./controllers/errorController');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/records', recordsRouter);
app.use(globalErrorHandler);

module.exports = app;