const aguid = require('aguid');
const hash = require('hash.js');

function serverSeedGenerator() {
    let guid = aguid();
    return hash.sha256().update(guid).digest('hex');
}

function clientSeedGenerator() {
    let allAllowedCharacters = '123456789';
    let result = '';
    for (let i = 0; i < 13; i++) {
        let indx = Math.floor(Math.random() * 9);
        result += allAllowedCharacters[indx];
    }
    return result;
}


module.exports = {serverSeedGenerator, clientSeedGenerator};