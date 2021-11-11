function isObjectEmpty(object) {
  return typeof object === 'undefined' || Object.entries(object).length === 0
}

export default isObjectEmpty
