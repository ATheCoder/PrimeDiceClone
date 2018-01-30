const generateToken = require('express').Router();
const EnableHelper = require('./enableHelpers');

generateToken.get('/generateToken', (req, res) => {
    let newToken = EnableHelper.generate2FASecret(32);
    res.status(200).json(newToken)
});

module.exports = generateToken;