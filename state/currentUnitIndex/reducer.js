import { SET_CURRENT_UNIT_INDEX } from './actions'

const currentUnitIndexReducer = (state = 0, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_CURRENT_UNIT_INDEX:
      return payload.index
    default:
      return state
  }
}

export default currentUnitIndexReducer
