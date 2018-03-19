const deposit = require('express').Router()
const AccessToken = require('../models/AccessTokenModel')
const axios = require('axios')
const PaymentAddress = require('../models/PaymentAddressModel')

deposit.post('/deposit', (req, res) => {
  if (req.body.accessToken) {
    AccessToken.findOne({accessToken: req.body.accessToken}).exec().then((accessTokenObject) => {
      if (!accessTokenObject) res.status(404).send('Access Token Not Found!')
      else {
        PaymentAddress.searchOne(accessTokenObject.user_id).then((searchResult) => {
          if (!searchResult) {
            let callbackURL = 'http://127.0.0.1/processPayment?secret=Zr9kRxthTYWgcjQg'
            return axios.get('https://blockchainapi.org/api/receive?method=create&address=1MqDMWugrXqNt371EtEBFX3vAcTNamhc9i&callback=' + callbackURL)
          } else {
            res.status(200).json(searchResult)
          }
        }).then(response => {
          if (response) return PaymentAddress.create({username: accessTokenObject.user_id, address: response.data.input_address})
        }).then(endResult => {
          if (endResult) {
            res.status(200).json(endResult)
          }
        })
      }
    })
  } else res.status(400).send('Invalid arguments; make sure you added the arguments inside the body of the request.')
})

module.exports = deposit
