import { useEffect, useMemo, useState } from 'react'
import nextCookie from 'next-cookies'
import { initializeStore } from 'state/store'
import { Router } from 'next/router'
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

const Profile = ({ merchant }) => {
  const [requestingSeats, setRequestingSeats] = useState(1)
  const [alert, setAlert] = useState(false)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [isSendingRequest, setIsSendingRequest] = useState(false)

  const restaurants = [
    {
      id: 1,
      name: 'Da Lillo',
      description: 'Porcaccia la madonna, avqua a 8€',
      image: 'r1.jpg'
    },
    {
      id: 2,
      name: 'Pescaria',
      description: 'Mannaggia se è buono il pesce qua',
      image: 'r2.jpg',
    },
    {
      id: 3,
      name: 'Cannavacciuolo Bistrot',
      description: 'Hai cagato?',
      image: 'r4.jpg'
    },
    {
      id: 4,
      name: 'La Cadrega',
      description: 'Mangiare qui è un inganno',
      image: 'cadrega.jpg'
    }
  ]

  const prenotations =
    [
      {
        id: 10,
        owner: 1,
        merchantId: 4,
        dateOfPrenotation: 1637785265448,
        amount: 5,
        valid: false
      },
      {
        id: 11,
        owner: 12,
        merchantId: 4,
        dateOfPrenotation: 1637785265448,
        amount: 5,
        valid: false
      },
      {
        id: 12,
        owner: 1,
        merchantId: 2,
        dateOfPrenotation: 1637785265448,
        amount: 15,
        valid: true
      },
      {
        id: 13,
        owner: 1,
        merchantId: 2,
        dateOfPrenotation: 1637785265448,
        amount: 15,
        valid: false
      },
      {
        id: 14,
        owner: 1,
        merchantId: 2,
        dateOfPrenotation: 1637785265448,
        amount: 15,
        valid: false
      },
      {
        id: 15,
        owner: 1,
        merchantId: 2,
        dateOfPrenotation: 1637785265448,
        amount: 15,
        valid: true
      },

    ]

  const user = {
    id: 1,
    firstName: 'Marco',
    lastName: 'Luddeni',
    email: 'luddenimarco@gmail.com',
    phone: '+390000000000',
  }

  const today = dayjs().format('DD/MM/YYYY')

  return (
    <>
      <Head>
        <title>CePosto | Profilo</title>
      </Head>
      <div className="w-full">
        {!isObjectEmpty(alert) && (
          <AlertFloat alert={alert} setAlert={setAlert} />
        )}
        <div className='p-10'>
          <div className="container w-100 lg:w-4/5 mx-auto flex flex-col space-y-4">

            <div id='info' className='w-full text-center'>
              <h2 className='text-center text-3xl'>Info personali</h2>
              <p className={`w-1/2 text-left mx-auto rounded border-6 border-gray-400
               p-3`}>
                Nome: {user.firstName}<br />
                Cognome: {user.lastName}<br />
                Telefono: {user.phone} <br />
                Email: {user.email} <br />

              </p>
            </div>
            <div id='books' className='w-full text-center'>
              <h2 className='text-center text-3xl'>Le mie prenotazioni</h2>
              <p className={`w-1/2 text-left mx-auto rounded border-6 border-gray-400
               p-3`}>
                {
                  prenotations
                    .filter(book => book.owner === user.id)
                    .sort((a, b) => a.valid < b.valid)
                    .map(
                      book => {
                        return (
                          <BookCard
                            id={book.id}
                            name={
                              restaurants.filter(
                                rs => rs.id === book.merchantId
                              )[0].name
                            }
                            dateOfPrenotation={book.dateOfPrenotation}
                            amount={book.amount}
                            valid={book.valid}
                          />
                        )
                      }
                    )
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Profile.getInitialProps = async (context) => {
  const { res } = context
  const reduxStore = initializeStore()
  let { token } = nextCookie(context)
  // try {
  //   token = checkToken({
  //     tokenFromStorage: token,
  //     tokenInQueryString: context.query.token
  //   })
  // } catch (err) {
  //   if (typeof window !== 'undefined') Router.push('/')
  //   else {
  //     res.writeHead(302, {Location: '/' })
  //     res.end()
  //   }
  // }

  try {
    const urlCurrentMerchant = Number(context.query.id)

    //await initStore(reduxStore, token, urlCurrentUnitIndex)

    // const merchant = await axiosRes.get(
    //   `/${urlCurrentMerchant}`,
    //   { headers: { 'x-access-token': token } }
    // )


    // return {
    //   token,
    //    merchant,
    //   initialReduxState: reduxStore.getState()
    // }

    return {}
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
}

export default Profile