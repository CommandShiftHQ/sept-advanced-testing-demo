const express = require('express');
const helloRouter = require('./routes/hello');

const app = express();

app.use(express.json());
app.use('/', helloRouter);


module.exports = app;