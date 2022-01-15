import { useEffect, useMemo, useState } from 'react'
import nextCookie from 'next-cookies'
import { initializeStore } from 'state/store'
import { useRouter } from 'next/router'
import Router from 'next/router'
import { checkToken } from 'utils/checkToken'
import initStore from 'state/initStore'
import { userLogout } from 'state/auth/actions'
import Head from 'next/head'
import Button from "../../components/Button"
import dayjs from 'dayjs'
import Dialog from 'components/Dialog'
import AlertFloat from 'components/AlertFloat'
import isObjectEmpty from 'utils/isObjectEmpty'
import BookCard from 'components/BookCard'
import { useStore, useDispatch } from 'react-redux'
import { axiosPrenotation } from 'utils/axiosInstance'
import InputBook from 'components/InputBook'

const Manage = (props) => {
  const dispatch = useDispatch()

  return (
    <>
      <Head>
        <title>CePosto | Gestione</title>
      </Head>
      <div className="w-full">
        {!isObjectEmpty(alert) && (
          <AlertFloat alert={alert} setAlert={setAlert} />
        )}
        <div className='p-10'>
          <div className="container w-100 lg:w-4/5 mx-auto flex flex-col space-y-4">

            <div id='info' className='w-full text-center'>
              <h2 className='text-center text-3xl'>I miei ristoranti</h2>


            </div>

          </div>
        </div>
      </div>
    </>
  )
}

Manage.getInitialProps = async (context) => {
  const { res } = context
  const reduxStore = initializeStore()
  let { token } = nextCookie(context)
  try {
    token = checkToken({
      tokenFromStorage: token,
      tokenInQueryString: context.query.token
    })
  } catch (err) {
    if (typeof window !== 'undefined') Router.push('/')
    else {
      res.writeHead(302, { Location: '/' })
      res.end()
    }
  }
  if (typeof token !== 'undefined' && token !== '')
    try {
      const username = reduxStore.getState().auth.username
      await initStore(reduxStore, token, username)
      const idCurrentUser = reduxStore.getState().user.id

      const { data: prenotations } = await axiosPrenotation.get(
        `?userId=${idCurrentUser}`,
        { headers: { 'access-token': token } }
      )

      return {
        prenotations,
        token,
        initialReduxState: reduxStore.getState()
      }
    } catch (err) {
      console.error(err)

      if (err?.response?.status === 401) {
        reduxStore.dispatch(userLogout())

        if (typeof window !== 'undefined') Router.push('/')
        else {
          res.writeHead(302, { Location: '/' })
          res.end()
        }
      }

      return {
        notFound: true
      }
    }
  else {
    Router.push('/')
    return {
      notFound: true
    }
  }
}

export default Manage