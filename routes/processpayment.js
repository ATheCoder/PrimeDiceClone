const processpayment = require('express').Router();
const PaymentAddress = require('../models/PaymentAddressModel');
const User = require('../models/UserModel');

processpayment.get('/processPayment', (req, res) => {
    let {value, input_address, confirmations, transaction_hash, input_transaction_hash, destination_address, secret} = req.query;
    PaymentAddress.findOne({address: input_address}, function (err, result) {
        if(err) return err;
        if(!result){

        }
        else{
            if(value > 0 && confirmations > 0 && secret === 'Zr9kRxthTYWgcjQg'){
                User.findOne({username: result.username}, function (err, foundUser) {
                    if(err) return console.log(err);
                    if(!foundUser) return console.log('User depositing was not found!');
                    foundUser.update({$inc: {balance: value / 100000000}}, function (err, updatedResult) {
                        if(err) return console.log(err);
                        res.status(200).send('*ok*');
                    })
                })
            }
        }
    })
});

module.exports = processpayment;