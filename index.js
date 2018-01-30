const User = require('./models/UserModel');
const AccessToken = require('./models/AccessTokenModel');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', routes);

app.listen(80, () => {
    console.log('Listening on port 80');
});