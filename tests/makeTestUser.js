let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);


makeTestUser = (done) => {
    chai.request(server)
        .post('/register')
        .send({username: 'NervousFiend', password: '76527652arash'});
    chai.request(server)
        .post('/login')
        .send({username: 'NervousFiend', password: '76527652arash'})
        .end((err, res) => {
            return res.body;
        })
};

module.exports = makeTestUser;