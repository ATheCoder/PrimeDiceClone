const index = require('express').Router();
const login = require('./login');
const logout = require('./logout');
const register = require('./register');
const bet = require('./bet');
const deposit = require('./deposit');
const processPayment = require('./processpayment');
const twoFA = require('./2fa/index');

index.use('/', login);
index.use('/', logout);
index.use('/', register);
index.use('/', bet);
index.use('/', deposit);
index.use('/', processPayment);
index.use('/', twoFA);

module.exports = index;