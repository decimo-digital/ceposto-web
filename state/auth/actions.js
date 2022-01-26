import cookie from 'js-cookie'
import { axiosAuth } from '../../utils/axiosInstance'
import isObjectEmpty from '../../utils/isObjectEmpty'
import Router from 'next/router'
// Action types
const USER_LOGIN = 'USER_LOGIN'
const USER_LOGOUT = 'USER_LOGOUT'

// Actions
const userLogin = (token, email) => {
  return async function login(dispatch, getState) {
    let options = {
      expires: 0.25, // six hours
      secure: true,
      sameSite: 'Lax'
    } //, httpOnly: true }
    if (typeof cookie.get('token') === 'undefined') {
      cookie.set('token', token, options)
    }

    dispatch({ type: USER_LOGIN, payload: { token, username: email } })

  }
}

const userLogout = () => {
  let options = { expires: 1 }

  cookie.remove('token', options)
  // to support logging out from all windows
  typeof window !== 'undefined' &&
    window.localStorage.setItem('logout', Date.now())
  return { type: USER_LOGOUT }
}

export { USER_LOGIN, USER_LOGOUT, userLogin, userLogout }
