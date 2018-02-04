let chai = require('chai')
let mongoose = require('mongoose')
let chaiHttp = require('chai-http')
let server = require('../../index')
let should = chai.should()

chai.use(chaiHttp)

describe('logout', () => {
  before((done) => {
    mongoose.connect('mongodb://arasharbabi.com:27017/primedice', function () {
      mongoose.connection.db.dropDatabase().then(() => {
        done()
      })
    })
  })
  let accessToken = ''
  it('should register', (done => {
    chai.request(server)
      .post('/register')
      .send({username: 'NervousFiend', password: '76527652arash'})
      .end((err, res) => {
        if (err) console.log(err)
        res.should.have.status(200)
        res.text.should.be.eq('User created Successfully')
        done()
      })
  }))
  it('should login successfully', (done) => {
    chai.request(server)
      .post('/login')
      .send({username: 'NervousFiend', password: '76527652arash'})
      .end((err, res) => {
        if (err) console.log(err)
        res.should.have.status(200)
        res.body.should.be.a('string')
        accessToken = res.body
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
