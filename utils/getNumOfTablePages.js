function getNumOfTablePages(totItems) {
  return totItems % 10 === 0
    ? Math.floor(totItems / 10) + 1
    : Math.floor(totItems / 10) + 2
}

module.exports = { getNumOfTablePages }
