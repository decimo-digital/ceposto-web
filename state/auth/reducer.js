import { USER_LOGIN, USER_LOGOUT } from './actions'

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return Object.assign({}, state, { ...action.payload })
    case USER_LOGOUT:
      return {}
    default:
      return state
  }
}

export default authReducer
