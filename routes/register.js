const register = require('express').Router();
const User = require('../models/UserModel');
const SeedPair = require('../models/SeedPairModel');

register.post('/register', (req, res) => {
    if(req.body.username && req.body.password && req.body.passwordConf){
        let userData = {
            username: req.body.username,
            password: req.body.password,
            balance: 0
        };
        User.create(userData, (err, user) => {
            if(err) return res.send(err);
            SeedPair.createSeedPair(user.username, function(){
                return res.send('User Created');
            })
        })
    }
    else{
        res.send('Nothing Happened');
    }
});

module.exports = register;