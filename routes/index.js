const index = require('express').Router()
const login = require('./login')
const logout = require('./logout')
const register = require('./register')
const bet = require('./bet')
const deposit = require('./deposit')
const processPayment = require('./processpayment')
const twoFA = require('./2fa/index')
const users = require('./users')
const password = require('./password')
const faucet = require('./faucet')
const passwordReset = require('./passwordReset')
const email = require('./email')
const passwordResetFinal = require('./passwordResetFinal')

index.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

index.use('/', login)
index.use('/', logout)
index.use('/', register)
index.use('/', bet)
index.use('/', deposit)
index.use('/', processPayment)
index.use('/', twoFA)
index.use('/', users)
index.use('/', password)
index.use('/', faucet)
index.use('/', passwordReset)
index.use('/', email)
index.use('/', passwordResetFinal)

module.exports = index
