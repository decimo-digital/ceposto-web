import { GET_PRENOTATIONS, UPDATE_PRENOTATION } from './actions'

const prenotationsReducer = (state = 0, action) => {
  const { type, payload } = action

  switch (type) {
    case GET_PRENOTATIONS:
      return payload
    case UPDATE_PRENOTATION:
      return {
        ...state,
        prenotations: state.prenotations.map(
          prenotation =>
            prenotation.id === payload.prenotationId
              ? {
                ...prenotation, amount: payload.requestingSeats
              }
              : prenotation
        )
      }
    default:
      return state
  }
}

export default prenotationsReducer
