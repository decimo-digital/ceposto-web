import {
  axiosMenu,
  axiosMerchant,
} from 'utils/axiosInstance'
import { menuItemsType } from 'utils/enums'


/* Action types */

// Merchants
const GET_MERCHANTS = 'GET_MERCHANTS'
const UPDATE_MERCHANT_FREE_SEATS = 'UPDATE_MERCHANT_FREE_SEATS'
const ADD_MERCHANT = 'ADD_MERCHANT'

// Menu
const GET_MENU = 'GET_MENU'
const ADD_EMPTY_MENU = 'ADD_EMPTY_MENU'

/* Actions */

// Merchants
const getMerchants = () => {
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

const addMerchant = (merchantInfos) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth

    const result = await axiosMerchant.post(
      `/`, merchantInfos,
      { headers: { 'access-token': token } }
    )

    merchantInfos.id = result.data.id

    dispatch({
      type: 'ADD_MERCHANT',
      payload: { merchantInfos }
    })
  }
}

const updateMerchantFreeSeats = ({ merchantId, updatedFreeSeats }) => {
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
const getMenu = (merchantId, isFromAdmin = false) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth

    const { data: menu } = await axiosMenu.get(`/${merchantId}`,
      { headers: { 'access-token': token } })
    console.log(menu)
    if (isFromAdmin)
      dispatch({
        type: 'GET_MENU',
        payload: {
          id: merchantId, menu
        }
      })
    else
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

const addEmptyItemMenu = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'ADD_EMPTY_MENU',
      payload: {
        newPiatto: {
          menuItemId: 123,
          merchantId: 1,
          categoryId: 1,
          name: 'aaa',
          price: 10
        }
      }
    })
  }
}



export {
  GET_MERCHANTS,
  UPDATE_MERCHANT_FREE_SEATS,
  GET_MENU,
  ADD_MERCHANT,
  ADD_EMPTY_MENU,
  getMenu,
  getMerchants,
  updateMerchantFreeSeats,
  addMerchant,
  addEmptyItemMenu
}
