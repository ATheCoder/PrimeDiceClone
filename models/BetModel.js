const mongoose = require('mongoose');
const SeedPair = require('./SeedPairModel');
const showRoll = require('../showRoll');
const User = require('./UserModel');

mongoose.connect('mongodb://arasharbabi.com:27017/primedice');

let BetSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    BetAmount: {
        type: Number,
        required: true
    },
    RollNumber: {
        type: Number
    },
    Win: {
        type: Boolean
    },
    clientSeed: {
        type: String,
        required: true
    },
    serverSeedEncrypted: {
        type: String,
        required: true
    },
    serverSeed: {
        type: String
    },
    condition: {
        type: String,
        required: true
    },
    target: {
        type: Number,
        required: true
    }

},
    {timestamps: true});

BetSchema.statics.makeBet = function (username, amount, condition, target, cb) {
    console.log('Username is: ' + username);
    User.findOne({username: username}).exec(function(err, user){
        if(err) return console.log(err);
        if(!user) return console.log('User not found!');
        if(user.balance < amount) return cb('You don\'t have enough balance!');
        if(user.balance >= amount){
        SeedPair.findOne({username: username}).exec(function(err, seedPair){
            if(err){
                console.log(err);
                cb(false);
                return;
            }
            if(!seedPair){
                console.log('SeedPair Not Found');
                cb(false);
                return;
            }
            let roll = showRoll(seedPair.serverSeed, seedPair.clientSeed, seedPair.nonce);
            console.log('nonce: ' +seedPair.nonce);
            seedPair.nonce++;
            seedPair.save();
            let win = false;
            let winChance;
            let payout;
            switch(condition){
                case '<':
                    if(roll < target){
                        win = true;
                        winChance = target;
                    }
                    break;
                case '>':
                    if(roll > target){
                        win = true;
                        winChance = 99.99 - target;
                    }
            }
            payout = ((1/winChance) * (100 - 1)).toFixed(2);
            console.log('payout is: ' + payout);
            User.update({username: username}, {$inc: {balance: (win ? +(amount * payout - amount) : -amount)}}, function (err, user) {
                if(err){
                    console.log(err);
                    cb(false);
                    return;
                }
                Bet.create({username: username,
                    BetAmount: amount,
                    RollNumber: roll,
                    Win: win,
                    clientSeed: seedPair.clientSeed,
                    serverSeed: seedPair.serverSeed,
                    serverSeedEncrypted: seedPair.serverSeedEncrypted,
                    condition: condition,
                    target: target
                }, function (err, bet) {
                    if(err){
                        console.log(err);
                        cb(false);
                        return;
                    }
                    cb(bet);
                })
            });
        })
        }
    })
};

let Bet = mongoose.models.Bet || mongoose.model('Bet', BetSchema);

module.exports = Bet;


