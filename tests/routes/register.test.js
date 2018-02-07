let chai = require('chai')
let mongoose = require('mongoose')
let chaiHttp = require('chai-http')
let server = require('../../index')
let should = chai.should()

chai.use(chaiHttp)

describe('register', () => {
  before((done) => {
    mongoose.connect('mongodb://arasharbabi.com:27017/primedice', function () {
      mongoose.connection.db.dropDatabase().then(() => {
        done()
      })
    })
  })
  it('should register', done => {
    chai.request(server)
      .post('/register')
      .send({username: 'test1', password: 'test2'})
      .end((err, res) => {
        res.should.have.status(200)
        res.text.should.be.eq('User created Successfully')
        done()
      })
  })
  describe('show appropriate error message', () => {
    it('user already exists', done => {
      chai.request(server)
        .post('/register')
        .send({username: 'test1', password: 'text2'})
        .end((err, res) => {
          res.should.have.status(400)
          res.text.should.be.eq('Username already exists')
          done()
        })
    })
  })
})
