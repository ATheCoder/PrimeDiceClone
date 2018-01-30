const twoFA = require('express').Router();
const generateToken = require('./generateToken');
const enable = require('./enable');

twoFA.use('/2fa/', generateToken);
twoFA.use('/2fa/', enable);

module.exports = twoFA;