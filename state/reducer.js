import { combineReducers } from 'redux'

import merchantsReducer from './units/reducer'
import userReducer from './user/reducer'
import authReducer from './auth/reducer'
import currentUnitIndexReducer from './currentUnitIndex/reducer'

const appReducer = combineReducers({
  auth: authReducer,
  merchants: merchantsReducer,
  currentUnitIndex: currentUnitIndexReducer,
  user: userReducer
})

const rootReducer = (state = {}, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
