let chai = require('chai')
let speakeasy = require('speakeasy')
let mongoose = require('mongoose')
let chaiHttp = require('chai-http')
let server = require('../../../index')
let makeTestUser = require('../../makeTestUser')
let should = chai.should()

chai.use(chaiHttp)

describe('Two factor authentication Enable', () => {
  let exampleOTPSecret = 'KE5UGUCKNM3VG3KPF5JUOUJRPJSHA4DL'
  let exampleOTPToken = speakeasy.totp({
    secret: exampleOTPSecret,
    encoding: 'base32'
  })
  let accessToken = ''
  before((done) => {
    makeTestUser(0.1, function (newAccessToken) {
      accessToken = newAccessToken
      done()
    })
  })
  describe('show appropriate error message', () => {
    it('Invalid 2FA Token', () => {
      chai.request(server)
        .post('/2fa/enable')
        .send({twoFASecret: exampleOTPSecret, twoFAToken: 'InvalidToken', accessToken: accessToken})
        .end((err, res) => {
          res.should.have.status(400)
          res.text.should.be.eq('Token and Secret don\'t match')
        })
    })
  })
  it('should Enable 2FA', done => {
    chai.request(server)
      .post('/2fa/enable')
      .send({twoFASecret: exampleOTPSecret, twoFAToken: exampleOTPToken, accessToken: accessToken})
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
  it('should Disable 2FA', done => {
    chai.request(server)
      .post('/2fa/disable')
      .send({twoFASecret: exampleOTPSecret, twoFAToken: exampleOTPToken, accessToken: accessToken})
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
})
