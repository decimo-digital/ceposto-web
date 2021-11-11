function checkToken({ tokenFromStorage, tokenInQueryString }) {
  if (typeof tokenInQueryString === 'undefined') {
    if (typeof tokenFromStorage === 'undefined')
      throw new Error('Token is not defined, cannot proceed if not logged in')

    return tokenFromStorage
  }

  return tokenInQueryString
}

export { checkToken }
