let chai = require('chai')
let mongoose = require('mongoose')
let chaiHttp = require('chai-http')
let server = require('../../index')
chai.should()

chai.use(chaiHttp)

describe('/login', () => {
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
      .send({username: 'NervousFiend', password: '76527652arash'})
      .end((err, res) => {
        if (err) console.log(err)
        res.should.have.status(200)
        res.text.should.be.eq('User created Successfully')
        done()
      })
  })
  it('should give accessToken', (done) => {
    chai.request(server)
      .post('/login')
      .send({username: 'NervousFiend', password: '76527652arash'})
      .end((err, res) => {
        if (err) console.log(err)
        res.should.have.status(200)
        res.body.should.be.a('string')
        done()
      })
  })
  it('should not give an accessToken', done => {
    chai.request(server)
      .post('/login')
      .send({username: 'NervousFiend'})
      .end((err, res) => {
        if (err) console.log(err)
        res.should.have.status(400)
        done()
      })
  })
  describe('show appropriate error message', () => {
    it('Username and Password do not exist', (done) => {
      chai.request(server)
        .post('/login')
        .send({username: 'WrongUsernameHere', password: 'WrongPasswordHere'})
        .end((err, res) => {
          if (err) console.log(err)
          res.should.have.status(400)
          res.text.should.be.eq('Incorrect information')
          done()
        })
    })
    it('Username correct but password wrong', done => {
      chai.request(server)
        .post('/login')
        .send({username: 'NervousFiend', password: 'WrongPasswordHere'})
        .end((err, res) => {
          if (err) console.log(err)
          res.should.have.status(400)
          res.text.should.be.eq('Incorrect information')
          done()
        })
    })
  })
})
