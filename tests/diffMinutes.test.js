const diffMinutes = require('../utils/diffMinutes')

it('Should give the differens of two dates in minutes', () => {
  let firstMinute = Date.now() + 30 * 60000
  let secondMinute = Date.now()
  expect(diffMinutes(firstMinute, secondMinute)).toBe(30)
})
