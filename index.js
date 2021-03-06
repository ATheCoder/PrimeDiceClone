const config = require('./config')
const mongoose = require('mongoose')
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

mongoose.connect(config.databaseURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!') // eslint-disable-line no-console
    throw error
  }

  // feed some dummy data in DB.
})

if (!module.parent) {
  let port = config.port
  app.listen(port, () => {
    console.log('Listening on port ' + port)
  })
}

app.get('/', (req, res) => {
  res.send('I am alive right now')
})

module.exports = app
