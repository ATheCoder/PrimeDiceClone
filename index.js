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





// app.post('/register', (req, res) => {
//     if(req.body.username && req.body.password && req.body.passwordConf){
//         let userData = {
//             username: req.body.username,
//             password: req.body.password,
//             passwordConf: req.body.passwordConf
//         };
//         User.create(userData, (err, user) => {
//             if(err) return res.send(err);
//             return res.send('User Created');
//         })
//     }
//     else{
//         res.sendStatus('Nothing Happend');
//     }
// });
//
// app.post('/login', (req, res) => {
//     if(req.body.username && req.body.password){
//         let username = req.body.username;
//         let password = req.body.password;
//         User.auth(username, password, function(guid){
//             if(!guid){
//                 res.send('Login Unsuccessful')
//             }
//             else{
//                 res.send('Login Successful: ' + guid)
//             }
//         })
//     }
// });
//
// app.post('/logout', (req, res) => {
//     if(req.body.username && req.body.accessToken){
//         let accessToken = req.body.accessToken;
//         let username = req.body.username;
//         AccessToken.logout(username, accessToken, function (result) {
//             if(!result){
//                 res.send('Logout Unsuccessful')
//             }
//             else{
//                 res.send('Logout Successful')
//             }
//         })
//     }
// });