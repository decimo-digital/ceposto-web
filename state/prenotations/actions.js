import { axiosPrenotation } from "utils/axiosInstance"

// Action types
const GET_PRENOTATIONS = 'GET_PRENOTATIONS'
const UPDATE_PRENOTATION = 'UPDATE_PRENOTATION'

// Actions
const getUserPrenotations = (userId) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth

    const { data: prenotations } = await axiosPrenotation.get(
      `?userId=${userId}`,
      { headers: { 'access-token': token } }
    )

    dispatch({
      type: 'GET_PRENOTATIONS',
      payload: {
        prenotations
      }
    })
  }
}

const getMerchantPrenotations = (userId) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth

    const { data: prenotations } = await axiosPrenotation.get(
      `/${merchantId}/prenotations`,
      { headers: { 'access-token': token } }
    )

    dispatch({
      type: 'GET_PRENOTATIONS',
      payload: {
        prenotations
      }
    })
  }
}

const updatePrenotation = ({ prenotationId, requestingSeats }) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth

    console.log('update')

    dispatch({
      type: 'UPDATE_PRENOTATION',
      payload: {
        prenotationId, requestingSeats
      }
    })
  }
}

export {
  GET_PRENOTATIONS,
  UPDATE_PRENOTATION,
  getUserPrenotations,
  getMerchantPrenotations,
  updatePrenotation
}
