const bet = require('express').Router()
const AccessToken = require('../models/AccessTokenModel')
const Bet = require('../models/BetModel')
const cors = require('cors')

bet.use(cors())

bet.post('/bet', (req, res) => {
  console.time('startBetRoute')
  if (req.body.accessToken && req.body.amount && req.body.condition && req.body.target) {
    let {accessToken, amount, condition, target} = req.body
    let username = ''
    AccessToken.findOne({accessToken: accessToken}).exec(function (err, result) {
      if (err) return console.log(err)
      if (!result) res.status(400).send('AccessToken is invalid')
      else {
        username = result.user_id
        Bet.makeBet(username, amount, condition, target, function (bet) {
          if (bet === 'You don\'t have enough balance!') {
            res.status(409).send('Insufficient funds')
          } else if (bet) {
            let resultBet = Object.assign({}, bet)
            delete resultBet._doc._id
            delete resultBet._doc.serverSeed
            delete resultBet._doc.updatedAt
            delete resultBet._doc.__v
            console.timeEnd('startBetRoute')
            res.status(200).json(resultBet._doc)
          } else {
            res.status(500).send('Bet Made Unsuccessfully')
          }
        })
      }
    })
  } else {
    res.send('Nothing Happened')
  }
})

module.exports = bet
