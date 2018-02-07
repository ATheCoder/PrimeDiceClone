let chai = require('chai')
let chaiHttp = require('chai-http')
let mongoose = require('mongoose')
let server = require('../../../index')
let should = chai.should()

chai.use(chaiHttp)

describe('users', () => {
  let accessToken = ''
  before(done => {
    mongoose.connect('mongodb://arasharbabi.com:27017/primedice', function () {
      mongoose.connection.db.dropDatabase().then(() => {
        done()
      })
    })
  })
  it('should register', done => {
    chai.request(server)
      .post('/register')
      .send({username: 'NervousFiend', password: '76527652arash'})
      .end((err, res) => {
        res.should.have.status(200)
        res.text.should.be.eq('User created Successfully')
        done()
      })
  })
  it('should login successfully', (done) => {
    chai.request(server)
      .post('/login')
      .send({username: 'NervousFiend', password: '76527652arash'})
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('string')
        accessToken = res.body
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
