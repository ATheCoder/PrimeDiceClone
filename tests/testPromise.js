const PaymentAddress = require('../models/PaymentAddressModel')
const mongoose = require('mongoose')

mongoose.connect('mongodb://arasharbabi.com:27017/primedice', (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!') // eslint-disable-line no-console
    throw error
  }

  // feed some dummy data in DB.
})

PaymentAddress.dik('nervousfiend').then(newUser => console.log(newUser))
