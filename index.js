const User = require('./models/UserModel')
const AccessToken = require('./models/AccessTokenModel')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')
const compression = require('compression')

app.use(compression())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/', routes)

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

if (!module.parent) {
  app.listen(80, () => {
    console.log('Listening on port 80')
  })
}

app.get('/', (req, res) => {
  res.send('I am alive right now')
})

module.exports = app
