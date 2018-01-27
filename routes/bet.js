const bet = require('express').Router();
const AccessToken = require('../models/AccessTokenModel');
const Bet = require('../models/BetModel');

bet.post('/bet', (req, res) => {
    if(req.body.accessToken && req.body.amount && req.body.condition && req.body.target){
        let {accessToken, amount, condition, target} = req.body;
        let username = '';
        AccessToken.findOne({accessToken: accessToken}).exec(function (err, result) {
            if(err) return console.log(err);
            if(!result) return console.log('Access Token not found');
            username = result.user_id;
            Bet.makeBet(username, amount, condition, target, function (bet) {
                if(bet)
                    res.send('Bet Made Successfully');
                else{
                    res.send('Bet Made Unsuccessfully');
                }
            })

        })
    }
    else{
        res.send('Nothing Happened');
    }
});


module.exports = bet;