import {
  GET_USER,
  GET_USER_TICKETS,
  UPDATE_USER,
  SET_USER_IS_MERCHANT
} from './actions'

const userReducer = (state = {}, action) => {
  const { type, payload } = action

  switch (type) {
    case GET_USER:
      return { ...state, ...payload.user }
    case GET_USER_TICKETS:
      return { ...state, remainingTickets: payload.tickets }
    case UPDATE_USER:
      return { ...state, ...payload.user }
    case SET_USER_IS_MERCHANT:
      console.log('--->reducer', state)
      return {
        ...state,
        merchant: true
      }
    default:
      return state
  }
}

export default userReducer
