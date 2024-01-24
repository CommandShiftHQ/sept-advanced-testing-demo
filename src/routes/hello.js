const express = require('express');
const { hello } = require('../controllers/hello');

const helloRouter = express.Router();

helloRouter.get('/', hello);

module.exports = helloRouter;