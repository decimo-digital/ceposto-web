import {
  axiosMenu,
  axiosMerchant,
} from 'utils/axiosInstance'
import { menuItemsType } from 'utils/enums'


/* Action types */

// Merchants
const GET_MERCHANTS = 'GET_MERCHANTS'
const UPDATE_MERCHANT_FREE_SEATS = 'UPDATE_MERCHANT_FREE_SEATS'

// Menu
const GET_MENU = 'GET_MENU'

/* Actions */

// Merchants
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

// Menu
const getMenu = (merchantId) => {
  console.log('\nGetMenu')
  return async (dispatch, getState) => {
    const { token } = getState().auth

    const { data: menu } = await axiosMenu.get(`/${merchantId}`,
      { headers: { 'access-token': token } })


    dispatch({
      type: 'GET_MENU',
      payload: {
        id: merchantId, menu: {
          appetizers: menu.filter(item => item.categoryId === menuItemsType.APPETIZERS),
          first_dishes: menu.filter(item => item.categoryId === menuItemsType.FIRST_DISHES),
          second_dishes: menu.filter(item => item.categoryId === menuItemsType.SECOND_DISEHS),
          pizza: menu.filter(item => item.categoryId === menuItemsType.PIZZA),
          dessert: menu.filter(item => item.categoryId === menuItemsType.DESSERT)
        }
      }
    })
  }
}



export {
  GET_MERCHANTS,
  UPDATE_MERCHANT_FREE_SEATS,
  GET_MENU,
  getMenu,
  getMerchants,
  updateMerchantFreeSeats
}
