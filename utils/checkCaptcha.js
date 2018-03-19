const axios = require('axios')
let captchaSecretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'

const checkCaptcha = async (gRecaptchaResponse) => {
  let response = await axios.post('https://www.google.com/recaptcha/api/siteverify?secret=' + captchaSecretKey + '&response=' + gRecaptchaResponse)
  return response.data.success
}

module.exports = checkCaptcha
