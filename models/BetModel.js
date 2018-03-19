const mongoose = require('mongoose')
const SeedPair = require('./SeedPairModel')
const showRoll = require('../showRoll')
const User = require('./UserModel')

let BetSchema = new mongoose.Schema({
  username: {type: String, required: true, trim: true},
  BetAmount: {type: Number, required: true},
  RollNumber: {type: Number},
  Win: {type: Boolean},
  clientSeed: {type: String, required: true},
  serverSeedEncrypted: {type: String, required: true},
  serverSeed: {type: String},
  condition: {type: String, required: true},
  target: {type: Number, required: true}
},
{timestamps: true})

BetSchema.statics.makeBet = function (username, amount, condition, target, cb) {
  console.time('MakeBet')
  console.time('findUser')
  User.findOne({ username }).exec(function (err, user) {
    console.timeEnd('findUser')
    console.time('checkBalance')
    if (err) return console.log(err)
    if (!user) return console.log('User not found!')
    if (user.isBalanceEnough(amount)) {
      console.timeEnd('checkBalance')
      console.time('findSeedPair')
      SeedPair.findOne({ username }).exec(function (err, seedPair) {
        console.timeEnd('findSeedPair')
        if (err) {
          console.log(err)
          cb(false)
          return
        }
        if (!seedPair) {
          console.log('SeedPair Not Found')
          cb(false)
          return
        }
        console.time('calRoll')
        let roll = showRoll(seedPair.serverSeed, seedPair.clientSeed, seedPair.nonce)
        seedPair.nonce++
        seedPair.save()
        let win = false
        let winChance
        let payout
        switch (condition) {
          case '<':
            if (roll < target) {
              win = true
              winChance = target
            }
            break
          case '>':
            if (roll > target) {
              win = true
              winChance = 99.99 - target
            }
        }
        payout = ((1 / winChance) * (100 - 1)).toFixed(2)
        console.timeEnd('calRoll')
        console.time('updateBalance')
        let newBalance = (Math.round((user.balance + (win ? +(amount * payout - amount) : -amount)) * 100000000) / 100000000).toFixed(8)
        User.update({ username }, { $set: { balance: newBalance } }, function (err, newUser) {
          console.timeEnd('updateBalance')
          if (err) {
            console.log(err)
            cb(false)
            return
          }
          console.time('makeBetDB')
          Bet.create({ username,
            BetAmount: amount,
            RollNumber: roll,
            Win: win,
            clientSeed: seedPair.clientSeed,
            serverSeed: seedPair.serverSeed,
            serverSeedEncrypted: seedPair.serverSeedEncrypted,
            condition,
            target
          }, function (err, bet) {
            console.timeEnd('makeBetDB')
            if (err) {
              console.log(err)
              cb(false)
              return
            }
            bet._doc.newBalance = newBalance
            console.timeEnd('MakeBet')
            cb(bet)
          })
        })
      })
    } else {
      return cb('You don\'t have enough balance!')
    }
  })
}

let Bet = mongoose.models.Bet || mongoose.model('Bet', BetSchema)

module.exports = Bet
