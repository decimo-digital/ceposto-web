import {
  GET_USER,
  GET_USER_TICKETS,
  UPDATE_USER,
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
    default:
      return state
  }
}

export default userReducer
