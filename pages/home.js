
import MerchantCard from 'components/MerchantCard'
import { checkToken } from 'utils/checkToken'
import initStore from 'state/initStore'
import Head from 'next/head'
import { axiosMerchant } from 'utils/axiosInstance'
import { initializeStore } from 'state/store'
import nextCookie from 'next-cookies'
import Input from 'components/Input'
import { useState, useEffect } from "react"
import Button from 'components/Button'
import { userLogout } from 'state/auth/actions'
import { getMerchants } from 'state/units/actions'
import { useStore } from 'react-redux'
import Router from 'next/router'

const Home = (props) => {
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const store = useStore()
  const merchants = store.getState().merchants.merchants
    ??
    [
      {
        id: 1,
        storeName: 'Da Lillo',
        description: 'Porcaccia la madonna, avqua a 8€',
        image: 'r1.jpg'
      },
      {
        id: 2,
        storeName: 'Pescaria',
        description: 'Mannaggia se è buono il pesce qua',
        image: 'r2.jpg',
      },
      {
        id: 3,
        storeName: 'Cannavacciuolo Bistrot',
        description: 'Hai cagato?',
        image: 'r4.jpg'
      },
      {
        id: 4,
        storeName: 'La Cadrega',
        description: 'Mangiare qui è un inganno',
        image: 'cadrega.jpg'
      },
    ]

  const [pageCount, setPageCount] = useState(Number(((merchants.length / 10) + 1).toFixed(0)))

  useEffect(() => {
    if (page !== 1) setPage(1)
    setPageCount(
      Number(((merchants
        .filter(merchant =>
          ((merchant.storeName).toLowerCase()).includes(filter))
        .length / 10) + 1).toFixed(0))
    )
    console.log(pageCount)
  }, [filter])

  return (
    <>
      <Head>
        <title>CePosto</title>
      </Head>
      <div className="w-full">

        <div className="md:flex md:space-x-10 items-center bg-black p-24">
          <div className="w-full h-full text-center ">

            <p className='bold text-5xl text-white'> CePosto </p>

          </div>
        </div>
        <div className='p-10'>
          {
            merchants.length > 0
              ?
              (
                <div className='w-full '>
                  <div className="container w-1/2 mx-auto flex flex-col">
                    <Input
                      name={'Ricerca'}
                      type='text'
                      isRequired={false}
                      label="Ricerca"
                      onChange={(e) => { setFilter(e.target.value) }}
                    ></Input>

                  </div>
                </div>
              )
              : (
                <div className='w-full '>
                  <div className="container w-1/2 mx-auto flex flex-col">
                    Non sono presenti ristoranti. Addio
                  </div>
                </div>
              )
          }
          <div className='grid grid-cols-2 gap-x-0'>
            {
              merchants
                .filter(merchant =>
                  ((merchant.storeName).toLowerCase()).includes(filter))
                .slice((page - 1) * 10, (page - 1) * 10 + 10)
                .map(
                  merchant => {
                    const {
                      id,
                      storeName,
                    } = merchant
                    return (
                      <MerchantCard
                        id={id}
                        name={storeName}
                        description={''}
                        image={''}
                        type={'full'} />
                    )
                  }
                )
            }
          </div>
          {
            merchants
              .filter(merchant =>
                ((merchant.storeName).toLowerCase()).includes(filter))
              .slice((page - 1) * 10, (page - 1) * 10 + 10)
              .length > 1 && pageCount > 1 && (
              <div className="pt-2 pb-6 ">
                <div id="card" className="items-center xl:mx-64 lg:mx-auto">

                  <div className="container grid w-100 lg:w-4/5 mx-auto grid-cols-3 flex-col">
                    <Button
                      onClick={() => {
                        if (page > 1) {
                          setPage(page => page -= 1)
                        }
                      }}>
                      {
                        page == 1
                          ? ''
                          : <div className="flex flex-col md:flex-row overflow-hidden h-12
                          bg-gray-300 rounded-lg shadow-xl  mt-4 w-100 mx-2">
                            <p className='self-center mx-auto uppercase cursor-pointer'>indietro</p>
                          </div>
                      }

                    </Button>
                    <Button>
                      <div className="flex flex-col md:flex-row overflow-hidden h-12
                                             bg-gray-300 rounded-lg shadow-xl  mt-4 w-100 mx-2 cursor-normal">
                        <p className='self-center mx-auto uppercase'>{page}/{pageCount}</p>
                      </div>
                    </Button>
                    <Button
                      onClick={() => {
                        if (page < pageCount) {
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                          setPage(page => page += 1)
                        }

                      }}>
                      <div className="flex flex-col md:flex-row overflow-hidden h-12
                                             bg-gray-300 rounded-lg shadow-xl  mt-4 w-100 mx-2">


                        <p className='self-center mx-auto uppercase'>
                          avanti
                        </p>

                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            )
          }

        </div>
      </div>
    </>
  )
}
Home.getInitialProps = async (context) => {
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

  try {
    const username = reduxStore.getState().auth.username
    await initStore(reduxStore, token, username)
    await reduxStore.dispatch(getMerchants())

    // return {
    //   token,
    //   merchant,
    //   //initialReduxState: reduxStore.getState()
    // }
    return {
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
}
export default Home
