const twoFA = require('express').Router();
const generateToken = require('./generateSecret');
const enable = require('./enable');
const disable = require('./disable');

twoFA.use('/2fa/', generateToken);
twoFA.use('/2fa/', enable);
twoFA.use('/2fa/', disable);

module.exports = twoFA;