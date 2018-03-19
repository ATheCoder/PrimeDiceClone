let config = new function () {
  this.env = 'development'
  this.isProduction = () => { return this.env === 'production' }
  this.port = this.isProduction() ? 85 : 8585
  this.captchaSecret = this.isProduction() ? '6LeUI00UAAAAAMsoIVZvNOmGfTlR2KQjJ-Pu2kyx' : '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
  this.depositSecret = ''
  this.databaseURL = this.isProduction() ? 'mongodb://arasharbabi.com:27017/primedice' : 'mongodb://188.166.118.171:27017/primediceTEST'
}()

module.exports = config
