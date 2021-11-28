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
import Input from 'components/Input'
import { axiosPrenotation } from 'utils/axiosInstance'
import Infobox from 'components/Infobox'
import InputBook from 'components/InputBook'
import MerchantCard from 'components/MerchantCard'

const Merchants = ({ merchant }) => {
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

  const sendPrenotationRequest = () => {
    console.log('Invio prenotazione...')
    setIsSendingRequest(true)
    try {
      // const response = await axiosPrenotation(
      //   '/', {
      //   merchantId: currentMerchant.id,
      //   seatsAmount: requestingSeats,
      //   date: dayjs(),
      //   requesterId: 0
      // }
      // )
      console.log(
        {
          merchantId: currentMerchant.id,
          seatsAmount: requestingSeats,
          date: dayjs(),
          requesterId: 0
        }
      )
      setAlert({
        type: 'success',
        title: ` ${currentMerchant.name} ti aspetta!`,
        body: ` Puoi trovare la tua prenotazione nella sezione apposita del sito`

      })
      setIsSendingRequest(false)
      setIsOpenDialog(false)
    } catch (error) {
      console.log(error)
      setIsSendingRequest(false)
      setAlert({
        type: 'error',
        title: 'Errore',
        body: 'Ci dispiace, qualcosa è andato storto'
      })
    }

  }


  function handleRequestingSeatsChange(type) {
    switch (type) {
      case 'plus':
        setRequestingSeats(requestingSeats => requestingSeats += 1)
        break
      case 'minus':
        if (requestingSeats - 1 > 0)
          setRequestingSeats(requestingSeats => requestingSeats -= 1)

        break
      default:
        console.log('No good')
    }
  }

  const currentMerchant = typeof merchant !== 'undefined'
    ? merchant
    : {
      merchantId: 1,
      name: 'Cannavacciuolo Bistrot',
      freeSeats: 10,
      totalSeats: 300,
      longDescr: `Il bistrot è lieto di darvi il benvenuto al suo interno.
      Nel nostro ristorante potrete trovare una vasta scelta di prodotti di primissima qualità 
      che saranno in grado di soddisfare anche i palati più sopraffini. `
    }

  const today = dayjs().format('DD/MM/YYYY')

  return (
    <>
      <Head>
        <title>Prenota | {currentMerchant.name}</title>
      </Head>
      <div class="w-full">
        {!isObjectEmpty(alert) && (
          <AlertFloat alert={alert} setAlert={setAlert} />
        )}

        <div class="md:flex md:space-x-10 items-center bg-black p-24">
          <div class="w-full h-full text-center">

            <p className='bold text-5xl text-white'> {currentMerchant.name} </p>

          </div>
        </div>

        <div className='p-10'>
          <div class="container w-100 lg:w-4/5 mx-auto flex flex-col space-y-4">
            <div id='longDescr'>
              {
                currentMerchant.longDescr
              }
              <p>
                Controlla la disponibilità e prenota un tavolo!
              </p>
            </div>
            <div id='freeSeats' className='w-full text-center '>
              <p className={`w-1/2 mx-auto rounded border-6 ${currentMerchant.freeSeats > (currentMerchant.totalSeats / 2)
                ? 'border-green-200'
                : currentMerchant.freeSeats > 0
                  ? 'border-yellow-200'
                  : 'border-red-200'
                }
               p-3`}>
                {
                  currentMerchant.freeSeats > 0
                    ? ` Posti disponibili: ${currentMerchant.freeSeats}`
                    : `Il locale è al completo`
                }
              </p>
            </div>
            {
              currentMerchant.freeSeats > 0 && (
                <div id='prenota' className='w-full mx-auto items-center text-center'>
                  <Button
                    variant='primary'
                    onClick={() => { setIsOpenDialog(true) }}
                  >
                    PRENOTA UN TAVOLO
                  </Button>
                </div>
              )
            }


            <div className='container w-100 lg:w-4/5 mx-auto flex flex-col'>
              Ai nostri clienti piace anche. . .
              <div className='border border-1 border-gray-200 rounded-md '>
                {
                  restaurants
                    .filter((rs, i) => i < 3)
                    .map(
                      restaurant => {
                        const {
                          id,
                          name,
                          description,
                          image
                        } = restaurant
                        return (
                          <MerchantCard
                            id={id}
                            name={name}
                            description={description}
                            image={image}
                            type={'short'}
                          />
                        )
                      }
                    )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        isOpen={isOpenDialog}
        handleDismiss={() => {
          setIsOpenDialog(false)
          setRequestingSeats(1)
        }}
      >
        <div className="mt-4 space-y-8">
          <h2 class='font-medium text-2xl text-gray-500'>
            Prenotazione
          </h2>
          <span>Seleziona il numero di posti:</span>
          <div className='grid grid-cols-3'>

            <Button
              onClick={() => handleRequestingSeatsChange('minus')}
              className='border border-2 border-red-200 rounded' >
              <p className='text-6xl'>-</p>
            </Button>

            <div className='flex items-center'>
              <div className='w-1/2 mx-auto'>
                <InputBook
                  isRequired={false}
                  value={requestingSeats}
                  onChange={(e) => {
                    if (Number(e.target.value) <= currentMerchant.freeSeats
                      && Number(e.target.value > 0))
                      setRequestingSeats(Number(e.target.value))
                  }}
                />
              </div>
            </div>

            <Button
              onClick={() => handleRequestingSeatsChange('plus')}
              disabled={Number(currentMerchant.freeSeats) - Number(requestingSeats) < 1}
              className='border border-2 border-green-200 rounded'
            >
              <p className='text-6xl'>+</p>
            </Button>

          </div>
          <Infobox> Ricorda che avrai 30 minuti per presentarti al locale, altrimenti perderai la tua prenotazione.
          </Infobox>
          <div className='mx-auto text-right'>
            <Button
              variant='primary'
              onClick={sendPrenotationRequest}
            >
              Conferma
            </Button>
          </div>

        </div>

      </Dialog>
    </>
  )
}

Merchants.getInitialProps = async (context) => {
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

export default Merchants