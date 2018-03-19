const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')

function sendPasswordResetEmail (userEmail, resetToken, done) {
  let options = {
    auth: {
      api_user: 'NervousFiend',
      api_key: '76527652arash'
    }
  }

  let client = nodemailer.createTransport(sgTransport(options))

  let email = {
    from: 'passwordReset@arasharbabi.com',
    to: userEmail,
    subject: 'Password Reset',
    text: 'Please click on the link below in order to reset your password:\nhttp://arasharbabi.com/resetToken/' + resetToken
  }

  client.sendMail(email, function (err) {
    if (err) {
      console.log(err)
      done(true)
    } else {
      done(false, true)
    }
  })
}

module.exports = sendPasswordResetEmail
