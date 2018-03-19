const diffMinutes = (later, sooner) => {
  let diffMs = (+later) - (+sooner)
  return Math.round(((diffMs % 86400000) % 3600000) / 60000)
}

module.exports = diffMinutes
