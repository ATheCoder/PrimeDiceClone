const enable = require('express').Router();
const EnableHelper = require('./enableHelpers');
const Helper = require('../helper');

enable.post('/enable', (req, res) => {
    if(req.body.twoFASecret && req.body.twoFAToken && req.body.accessToken){
        let {twoFASecret, twoFAToken, accessToken} = req.body;
        Helper.getUserByAccessToken(accessToken, function (err, resultUser) {
            if(resultUser.twoFASecret) res.send(403).send('User already has 2FA Enabled.');
            else if(EnableHelper.validate2FAToken(twoFASecret, twoFAToken)){
                resultUser.update({$set: {twoFASecret: twoFASecret}}, function (err, newUser) {
                    if(err) res.status(500).send('Internal Server Error');
                    else{
                        res.status(200).send('Success')
                    }
                })
            }
            else{
                res.status(400).send('Token and Secret don\'t match')
            }
        })
    }
    else res.status(400).send('Invalid arguments; make sure you added the arguments inside the body of the request.');
});

module.exports = enable;