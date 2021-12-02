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


export {
  GET_MERCHANTS,
  getMerchants
}
