let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../../index')
let makeTestUser = require('../makeTestUser')
let should = chai.should()

chai.use(chaiHttp)

describe('Password Route', () => {
  let accessToken = ''
  before(done => {
    makeTestUser(0, function (newAccessToken) {
      accessToken = newAccessToken
      done()
    })
  })
  it('Changes password', done => {
    chai.request(server)
      .post('/password')
      .send({accessToken: accessToken, oldPassword: '76527652arash', password: 'arash76527652'})
      .end((err, res) => {
        if (err) console.log(err)
        res.should.have.status(200)
        res.body.should.have.property('message')
        res.body.should.have.property('newAccessToken')
        done()
      })
  })
  it('Can login with new Password', done => {
    chai.request(server)
      .post('/login')
      .send({username: 'NervousFiend', password: 'arash76527652'})
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('accessToken')
        accessToken = res.body.accessToken
        done()
      })
  })
  describe('Shows the right error message', () => {
    it('Incorrect password is provided', done => {
      chai.request(server)
        .post('/password')
        .send({accessToken: accessToken, oldPassword: '76527652arash', password: 'arash76527652'})
        .end((err, res) => {
          res.should.have.status(400)
          res.text.should.be.eq('Incorrect information')
          done()
        })
    })
  })
})
