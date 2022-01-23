// Action types
const SET_IS_MERCHANT = 'SET_IS_MERCHANT'

// Actions
const setIsMerchant = (isMerchant) => {
  console.log('iusmerchant? ', isMerchant)
  return { type: SET_IS_MERCHANT, payload: { isMerchant } }
}

export { SET_IS_MERCHANT, setIsMerchant }
