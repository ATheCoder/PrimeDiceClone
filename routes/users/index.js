const index = require('express').Router();
const me = require('./me');

index.use('/users', me);

module.exports = index;