const generateToken = require('express').Router()
const EnableHelper = require('./enableHelpers')

generateToken.get('/generateSecret', (req, res) => {
  let newToken = EnableHelper.generate2FASecret(16)
  res.status(200).json(newToken)
})

module.exports = generateToken
