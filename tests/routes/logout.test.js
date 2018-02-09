let chai = require('chai')
let mongoose = require('mongoose')
let chaiHttp = require('chai-http')
let server = require('../../index')
let makeTestUser = require('../makeTestUser')
let should = chai.should()

chai.use(chaiHttp)

describe('logout', () => {
  let accessToken = ''
  before((done) => {
    makeTestUser(0, function (newAccessToken) {
      accessToken = newAccessToken
      done()
    })
  })
  it('should logout successfully', (done) => {
    chai.request(server)
      .post('/logout')
      .send({accessToken: accessToken})
      .end((err, res) => {
        if (err) console.log(err)
        res.should.have.status(200)
        res.text.should.be.a('string')
        done()
      })
  })
})
