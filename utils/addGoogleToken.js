import cookie from 'js-cookie'

function addGoogleToken(token) {
  console.log('addGoogleToken: ', token)
  let options = {
    expires: 0.25, // six hours
    secure: true,
    sameSite: 'Lax'
  } //, httpOnly: true }
  cookie.set('porcoduio', token, options)

}
export { addGoogleToken }
