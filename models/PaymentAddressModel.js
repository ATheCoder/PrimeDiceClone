const mongoose = require('mongoose');

mongoose.connect('mongodb://arasharbabi.com:27017/primedice');

PaymentAddressSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: 86400,
        default: Date.now()
    }
});

PaymentAddressSchema.statics.searchOne = function (username, cb) {
    PaymentAddress.findOne({username: username}, function (err, foundUser) {
        if(err) return cb(err);
        else if(!foundUser) return cb(null , null);
        else{
            foundUser.update({createdAt: Date.now()}, function (err, newUser) {
                if(err) return cb(err);
                cb(null, foundUser)
            });
        }
    })
}

let PaymentAddress = mongoose.models.PaymentAddress || mongoose.model('PaymentAddress', PaymentAddressSchema);

module.exports = PaymentAddress;