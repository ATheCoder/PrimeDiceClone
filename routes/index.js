const index = require('express').Router();
const login = require('./login');
const logout = require('./logout');
const register = require('./register');
const bet = require('./bet');

index.use('/', login);
index.use('/', logout);
index.use('/', register);
index.use('/', bet);
index.get('/api', (req, res) => {
    res.cookie('token', JSON.stringify({username: 'hello'}));
    res.status(200).json({
        bang: 'Dank',
        dank: 'sank'
    })
});

module.exports = index;