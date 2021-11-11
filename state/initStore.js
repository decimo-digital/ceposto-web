import { getUserByEmail, getUserTickets } from './user/actions'
import {
  getOwnerUnits,
  getUnitsEmployees,
  getUnitsPendingEmployees,
  getUnitContract,
  getUnitsContracts
} from './units/actions'

import { userLogin, userLogout } from './auth/actions'

import isObjectEmpty from '../utils/isObjectEmpty'
import { setCurrentUnitIndex } from './currentUnitIndex/actions'
import Router from 'next/router'

async function initStore(store, token = '', urlCurrentUnitIndex) {
  try {
    await store.dispatch(userLogin(token))

    if (isObjectEmpty(store.getState().user)) {
      const email = store.getState().auth.username
      await store.dispatch(getUserByEmail(email))
    }

    if (isObjectEmpty(store.getState().units))
      await store.dispatch(getOwnerUnits())

    if (urlCurrentUnitIndex)
      store.dispatch(setCurrentUnitIndex(urlCurrentUnitIndex))
  } catch (err) {
    console.error('SONO NELLA INIT')

    throw err
  }
}

export default initStore
