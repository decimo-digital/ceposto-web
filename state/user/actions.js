import axios from '../../utils/axiosInstance'
import { axiosUsers } from '../../utils/axiosInstance'

// Action types
const GET_USER = 'GET_USER'
const GET_USER_TICKETS = 'GET_USER_TICKETS'
const UPDATE_USER = 'UPDATE_USER'
const SET_USER_IS_MERCHANT = 'SET_USER_IS_MERCHANT'

// Actions
const getUserByEmail = email => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { data: user } = await axiosUsers.get(`/`,
      {
        headers: { 'access-token': token },
      })

    dispatch({ type: GET_USER, payload: { user } })
  }
}

// Actions
const getUserTickets = () => {
  return async (dispatch, getState) => {
    const { token } = getState().auth

    const { data: tickets } = await axios.get('/users/me/tickets', {
      headers: { 'x-access-token': token },
    })

    const totTickets = tickets.tckt_buffer

    dispatch({ type: GET_USER_TICKETS, payload: { tickets: totTickets } })
  }
}

const updateUser = updatedField => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { user } = getState()

    const updatedUser = {
      ...user,
      [Object.keys(updatedField)[0]]: Object.values(updatedField)[0],
    }

    await axios.patch(
      `/users/${updatedUser.user_id}`,
      {
        unitId: updatedUser.user_unit_id,
        name: updatedUser.user_name_first,
        surname: updatedUser.user_name_surname,
        username: updatedUser.user_username,
        mob: updatedUser.user_mob,
        codFisc: updatedUser.user_cod_fisc,
        enabled: updatedUser.user_enabled,
        scopeId: updatedUser.user_scope_id,
        inPending: updatedUser.user_inpending,
        stellarId: updatedUser.user_publickey,
        imagePath: updatedUser.user_imgpath,
        canMakeTotal: updatedUser.user_chk7,
        canCashout: updatedUser.user_chk8,
        isBanned: updatedUser.user_chk9,
      },
      { headers: { 'x-access-token': token } }
    )

    dispatch({ type: UPDATE_USER, payload: { user: updatedUser } })
  }
}

const setUserMerchant = () => {
  console.log('setUserMerchant')
  return async (dispatch, getState) => {
    dispatch({ type: SET_USER_IS_MERCHANT })
  }
}


export {
  GET_USER,
  GET_USER_TICKETS,
  UPDATE_USER,
  SET_USER_IS_MERCHANT,
  getUserByEmail,
  getUserTickets,
  updateUser,
  setUserMerchant
}
