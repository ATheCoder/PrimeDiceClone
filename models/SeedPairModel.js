const mongoose = require('mongoose');
const User = require('./UserModel');
const seedGenerator = require('../seedGenerator');
const HashJS = require('hash.js');

mongoose.connect('mongodb://arasharbabi.com:27017/primedice')

let SeedPairSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    serverSeed: {
        type: String
    },
    clientSeed: {
        type: String
    },
    serverSeedEncrypted: {
        type: String
    },
    nonce: {
        type: Number
    }
    },
    {timestamps: true});

SeedPairSchema.statics.createSeedPair = function (username, cb) {
    User.findOne({username: username}).exec(function(err, user){
        if(err) return console.log(err);
        if(!user) return console.log('User Not Found!');
        let newServerSeed = seedGenerator.serverSeedGenerator();
        let newClientSeed = seedGenerator.clientSeedGenerator();
        let newServerSeedEncrypted = HashJS.sha256().update(newServerSeed).digest('hex');
        SeedPair.create({
            username: username,
            serverSeed: newServerSeed,
            clientSeed: newClientSeed,
            serverSeedEncrypted: newServerSeedEncrypted,
            nonce: 0
            },
            function(err, seedPair){
            if(err) return console.log(err);
            return cb(seedPair);
    });
    });
};

SeedPairSchema.pre('save', function (next) {
    let seedPair = this;
    if(!seedPair.nonce){
        seedPair.nonce = 0;
        next();
    }
    else{
        next();
    }
});


let SeedPair = mongoose.model('SeedPair', SeedPairSchema);

module.exports = SeedPair;


