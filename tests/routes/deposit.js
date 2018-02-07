let chai = require('chai')
const makeTestUser = require('../makeTestUser')
let chaiHttp = require('chai-http')
let server = require('../../index')
let should = chai.should()

chai.use(chaiHttp)

describe('Deposit end point', () => {
  let accessToken = ''
  before(done => {
    accessToken = makeTestUser(0.1, function (generatedToken) {
      accessToken = generatedToken
      done()
    })
  })
  it('shows deposit address', done => {
    chai.request(server)
      .post('/deposit')
      .send({accessToken: accessToken})
      .end((err, res) => {
        if (err) console.log(err)
        res.should.have.status(200)
        res.body.should.have.property('address')
        done()
      })
  })
})
