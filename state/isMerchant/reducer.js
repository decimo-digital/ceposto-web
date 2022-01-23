import { SET_IS_MERCHANT } from './actions'

const isMerchantReducer = (state = 0, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_IS_MERCHANT:
      console.log(payload.isMerchant, payload)
      return payload.isMerchant
    default:
      return state
  }
}

export default isMerchantReducer
