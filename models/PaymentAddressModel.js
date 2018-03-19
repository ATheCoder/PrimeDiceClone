const mongoose = require('mongoose')

let PaymentAddressSchema = new mongoose.Schema({
  username: {type: String, required: true},
  address: {type: String, required: true},
  createdAt: {type: Date, expires: 86400, default: Date.now()}
})

PaymentAddressSchema.statics.searchOne = function (username, cb) {
  return PaymentAddress.findOneAndUpdate({username: username}, {createdAt: Date.now()}, {new: true}).exec()
}

let PaymentAddress = mongoose.models.PaymentAddress || mongoose.model('PaymentAddress', PaymentAddressSchema)

module.exports = PaymentAddress
