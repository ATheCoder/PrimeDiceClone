const deposit = require('express').Router();
const AccessToken = require('../models/AccessTokenModel');
const axios = require('axios');
const PaymentAddress = require('../models/PaymentAddressModel');

deposit.post('/deposit', (req, res) => {
    if(req.body.accessToken){
        AccessToken.findOne({accessToken: req.body.accessToken}, function (err, accessTokenObject) {
            if(err) return console.log(err);
            if(!accessTokenObject) res.status(404).send('Access Token Not Found!');
            else{
                PaymentAddress.searchOne(accessTokenObject.user_id, function (err, searchResult) {
                    if(err) res.send(err);
                    else if(!searchResult){
                        let callbackURL = 'http://127.0.0.1/processPayment?secret=Zr9kRxthTYWgcjQg';
                        axios.get('https://blockchainapi.org/api/receive?method=create&address=1MqDMWugrXqNt371EtEBFX3vAcTNamhc9i&callback=' + callbackURL).then(function (response) {
                            let result = {};
                            PaymentAddress.create({username: accessTokenObject.user_id, address: response.data.input_address}, function (err, res) {
                                console.log('DANK')
                            });
                            result.address = response.data.input_address;
                            console.log(response.data);
                            res.status(200).json(result);
                        })
                    }
                    else{
                        res.status(200).json(searchResult)
                    }
                })
            }
        })
    }
    else res.status(400).send('Invalid arguments; make sure you added the arguments inside the body of the request.');
});

module.exports = deposit;