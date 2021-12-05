import axiosRes, {
  axiosUsers,
  axiosMerchant,
  axiosUnits
} from 'utils/axiosInstance'
import axiosInstance from 'utils/axiosInstance'
import { unitScopes, statUses, userRoles, assetsCodeOptions } from 'utils/enums'
import isObjectEmpty from 'utils/isObjectEmpty'
import dayjs from 'dayjs'
import { formatWeekdayShort } from 'utils/localeUtils'
import { readBinaryPhoto } from 'utils/fileReader'
import decamelizeObject from 'utils/decamelizeObject'

/* Action types */

// Merchants
const GET_MERCHANTS = 'GET_MERCHANTS'
const UPDATE_MERCHANT_FREE_SEATS = 'UPDATE_MERCHANT_FREE_SEATS'

/* Actions */

// Units
const getMerchants = () => {
  console.log('\nGetMerchants')
  return async (dispatch, getState) => {
    const { token } = getState().auth

    const { data: merchants } = await axiosMerchant.get(
      `/`,
      { headers: { 'access-token': token } }
    )

    dispatch({
      type: 'GET_MERCHANTS',
      payload: { merchants }
    })
  }
}

const updateMerchantFreeSeats = ({ merchantId, updatedFreeSeats }) => {
  console.log('\nupdateMerchantFreeSeats')
  return async (dispatch, getState) => {
    const { token } = getState().auth

    await axiosMerchant.patch(
      `/${merchantId}`, {
      freeSeats: updatedFreeSeats
    },
      { headers: { 'access-token': token } }
    )

    dispatch({
      type: 'UPDATE_MERCHANT_FREE_SEATS',
      payload: { merchantId, updatedFreeSeats }
    })
  }
}


export {
  GET_MERCHANTS,
  UPDATE_MERCHANT_FREE_SEATS,
  getMerchants,
  updateMerchantFreeSeats
}
