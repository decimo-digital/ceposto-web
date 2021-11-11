// Action types
const SET_CURRENT_UNIT_INDEX = 'SET_CURRENT_UNIT_INDEX'

// Actions
const setCurrentUnitIndex = (newUnitIndex) => {
  return { type: SET_CURRENT_UNIT_INDEX, payload: { index: newUnitIndex } }
}

export { SET_CURRENT_UNIT_INDEX, setCurrentUnitIndex }
