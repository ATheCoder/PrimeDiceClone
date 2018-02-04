const me = require('express').Router()
const Helper = require('../helper')

me.get('/me', (req, res) => {
  if (req.query.accessToken) {
    let {accessToken} = req.query
    let resultJSON = {}
    Helper.getUserByAccessToken(accessToken, function (err, result) {
      if (err) res.status(500).send('Internal Server Error')
      if (!result) {
        res.status(400).send('AccessToken is invalid.')
      } else {
        delete result._doc.password
        delete result._doc._id
        res.status(200).json(result)
      }
    })
  } else res.status(400).send('Invalid arguments.')
})

module.exports = me
