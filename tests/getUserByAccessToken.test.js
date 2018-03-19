const findUserByAccessToken = require('../routes/helper').getUserByAccessToken

it('Should get User from accessToken', async () => {
  findUserByAccessToken('fb66a69c-08ff-45f5-865e-adfa16974979', function (err, resultUser) {
    expect(resultUser).toHaveProperty('username')
  })
})
