let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../index');
let should = chai.should();

chai.use(chaiHttp);

describe('Two factor authentication Token generation', () => {
    it('Give Code', done => {
        chai.request(server)
            .get('/2fa/generateSecret')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.lengthOf(26);
                done();
            })
    })
})