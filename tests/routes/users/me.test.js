let chai = require('chai')
let chaiHttp = require('chai-http')
let mongoose = require('mongoose')
let server = require('../../../index')
let should = chai.should()
let makeTestUser = require('../../makeTestUser')

chai.use(chaiHttp)

describe('users', () => {
  let accessToken = ''
  before(done => {
    makeTestUser(0, function (newAccessToken) {
      accessToken = newAccessToken
      done()
    })
  })
  it('users/me', (done) => {
    chai.request(server)
      .get('/users/me?accessToken=' + accessToken)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('balance')
        res.body.should.have.property('username')
        res.body.should.not.have.property('password')
        res.body.should.not.have.property('_id')
        done()
      })
  })
  describe('Show appropriate error message', () => {
    it('when accessToken does not exist', done => {
      chai.request(server)
        .get('/users/me?accessToken=' + '1234556')
        .end((err, res) => {
          res.text.should.be.eq('AccessToken is invalid.')
          done()
        })
    })
  })
})
