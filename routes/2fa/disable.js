const disable = require('express').Router();
const enableHelper = require('./enableHelpers');
const Helper = require('../helper');

disable.post('/disable', (req, res) => {
   let {accessToken, twoFASecret, twoFAToken} = req.body;
   if(accessToken && twoFASecret && twoFAToken){
       Helper.getUserByAccessToken(accessToken, function (err, user) {
           if(err) res.status(500).send('Internal Server Error');
           else if(!user.twoFASecret) res.status(400).send('User does not have Two factor authentication');
           else if(enableHelper.validate2FAToken(twoFASecret, twoFAToken)){
               user.update({$unset: {twoFASecret: ""}}, function (err, result) {
                   if(err) res.status(500).send('Internal Server Error');
                   else{
                       res.status(200).send('Success');
                   }
               })
           }
           else{
               res.status(400).send('2FAToken and 2FASecret don\'t match!')
           }
       })
   }
});

module.exports = disable;