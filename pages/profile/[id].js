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
import { useStore, useDispatch, useSelector } from 'react-redux'
import { axiosPrenotation } from 'utils/axiosInstance'
import InputBook from 'components/InputBook'
import { signOut } from "next-auth/react"
import { getUserPrenotations, updatePrenotation } from 'state/prenotations/actions'
import { Field, Form, Formik, isObject } from 'formik'
import Input from 'components/Input'
import { addEmptyItemMenu, addMerchant, getMerchants } from 'state/units/actions'
import { setUserMerchant } from 'state/user/actions'

const Profile = (props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [alert, setAlert] = useState(false)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  // const openDialog = () => {
  //   setIsOpenDialog(true)
  // }
  const closeDialog = () => setIsOpenDialog(false)
  const store = useStore()
  const user = store.getState().user
  const merchants = store.getState().merchants.merchants
  const [requestingSeats, setRequestingSeats] = useState(1)
  const [selectedMerchant, setSelectedMerchant] = useState({})
  const [selectedPrenotation, setSelectedPrenotation] = useState(0)
  const [selectedPrenotationDate, setSelectedPrenotationDate] = useState(0)
  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const [isOpenAddMerchantDialog, setIsOpenAddMerchantDialog] = useState(false)
  const openUpdate = (merchant, bookId, bookDate) => {
    setSelectedPrenotation(bookId)
    setSelectedPrenotationDate(bookDate)
    setSelectedMerchant(merchant)
    setIsOpenDialog(true)

  }

  const addNewMerchant = async (merchantInfos) => {
    try {
      await dispatch(addMerchant(merchantInfos))
      await dispatch(setUserMerchant())
      setAlert({
        type: 'success',
        title: ` ${merchantInfos.storeName} inserito correttamente!`,
        body: `Vai nella sezione GESTORE per completare le info del tuo ristorante`
      })
      setIsOpenAddMerchantDialog(false)
    } catch (err) {
      console.error(err)
      setAlert({
        type: 'error',
        title: 'Qualcosa è andato storto',
        body: 'Si prega di riprovare tra qualche minuto',
        animate: true
      })
    }
  }

  useEffect(() => {
    setRequestingSeats(selectedMerchant.amount)
  }, [selectedMerchant])

  const prenotations = useSelector(state => state.prenotations.prenotations)

  const today = dayjs().format('DD/MM/YYYY')

  async function onSuccessfullDismiss(id, name) {
    prenotations.map(
      prenotation => {
        if (prenotation.id === id) {
          prenotation.valid = false
          prenotation.enabled = false
        }
      }
    )

    setAlert({
      type: 'success',
      title: 'Annullamento effettuato con successo',
      body: `La prenotazione da ${name} è stata annullata`,
      animate: true
    })
  }

  async function onErrorDismiss(name, id) {
    setAlert({
      type: 'error',
      title: 'Qualcosa è andato storto',
      body: 'Riprova tra qualche minuto',
      animate: true
    })
  }

  function handleLogout(e) {
    e.preventDefault()
    signOut({ redirect: false })
    dispatch(userLogout())
    router.push('/')
  }

  const modifyPrenotation = async () => {
    console.log('Modifico prenotazione...')
    setIsSendingRequest(true)
    const patchBody = {
      id: selectedPrenotation,
      merchantId: selectedMerchant.id,
      dateOfPrenotation: selectedPrenotationDate,
      date: selectedMerchant.dateOfPrenotation,
      amount: requestingSeats,
      enabled: true,
      valid: true
    }
    try {
      await axiosPrenotation.patch(
        '/', patchBody,
        { headers: { 'access-token': props.token } }
      )

      setAlert({
        type: 'success',
        title: `Modifica avvenuta con successo`,
        body: ` `

      })
      await dispatch(updatePrenotation({ prenotationId: selectedPrenotation, requestingSeats }))
      setIsSendingRequest(false)
      setIsOpenDialog(false)
    } catch (error) {
      console.log(error)
      setIsOpenDialog(false)
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
              <div className='p-3'>
                <Button
                  variant='primary'
                  onClick={handleLogout}
                >ESCI
                </Button>
              </div>
              {
                typeof user !== 'undefined' && typeof user.merchant !== 'undefined' && user.merchant !== true && user.email !== 'esercentenuovo@ceposto.it'
                && (
                  <div className='p-3'>
                    <Button
                      onClick={() => { setIsOpenAddMerchantDialog(true) }}
                      variant={'primary'}
                    >
                      SEI UN ESERCENTE? CLICCA QUI
                    </Button></div>
                )
              }


              <p className={`w-1/2 text-left mx-auto rounded border-6 border-gray-400
               p-3`}>
                Nome: {
                  typeof user !== 'undefined' && typeof user.firstName !== 'undefined'
                    ? (user.firstName).split(' ')[0]
                    : ''
                }<br />
                Cognome: {
                  typeof user !== 'undefined' && typeof user.lastName !== 'undefined'
                    ? user?.lastName
                    : ''

                }<br />
                Email: {
                  typeof user !== 'undefined' && typeof user.email !== 'undefined'
                    ? user?.email
                    : ''
                } <br />
              </p>

            </div>

            <div id='books' className='w-full text-center'>
              <h2 className='text-center text-3xl'>Le mie prenotazioni</h2>
              <p className={`w-1/2 text-left mx-auto rounded border-6 border-gray-400
               p-3`}>
                {typeof prenotations !== 'undefined' && prenotations
                  .filter(book => book.owner === user.id).length > 0
                  ? prenotations
                    .filter(book => book.owner === user.id)
                    .sort((a, b) => a.valid < b.valid)
                    .map(
                      book => {
                        return (
                          <BookCard
                            id={book.id}
                            name={
                              merchants.filter(
                                merchant => merchant.id === book.merchantId
                              )[0].storeName
                            }
                            dateOfPrenotation={book.dateOfPrenotation}
                            amount={book.amount}
                            valid={book.valid}
                            merchant={merchants.filter(
                              merchant => merchant.id === book.merchantId
                            )[0]}
                            enabled={book.enabled}
                            token={props.token}
                            onSuccessfullDismiss={onSuccessfullDismiss}
                            onErrorDismiss={onErrorDismiss}
                            setisopen={openUpdate}
                          />
                        )
                      }
                    )
                  : 'Non sono presenti prenotazioni.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        isOpen={isOpenDialog}
        handleDismiss={() => { setIsOpenDialog(false) }}
      >
        <div className="mt-4 space-y-8">
          <h2 className='font-medium text-2xl text-gray-500'>
            Modifica prenotazione
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
                    if (Number(e.target.value) <= selectedMerchant.freeSeats
                      && Number(e.target.value > 0))
                      setRequestingSeats(Number(e.target.value))
                  }}
                />
              </div>
            </div>

            <Button
              onClick={() => handleRequestingSeatsChange('plus')}
              disabled={Number(selectedMerchant.freeSeats) - Number(requestingSeats) < 1}
              className='border border-2 border-green-200 rounded'
            >
              <p className='text-6xl'>+</p>
            </Button>

          </div>

          <div className='mx-auto text-right'>
            <Button
              variant='primary'
              onClick={modifyPrenotation}
            >
              Conferma
            </Button>
          </div>

        </div>

      </Dialog>

      <Dialog
        isOpen={isOpenAddMerchantDialog}
        handleDismiss={() => {
          setIsOpenAddMerchantDialog(false)
        }}
        type='prenotation'
      >
        <div className="mt-4 space-y-8">
          <h2 className='font-medium text-2xl text-gray-500'>
            Aggiungi il tuo primo ristorante
          </h2>
          <Formik
            initialValues={{
              storeName: '',
              storeDescription: '',
              totalSeats: 0
            }}
            validate={(values) => {
              const errors = {}
              //check su input
              return errors
            }}
            onSubmit={async (values, actions) => {
              await addNewMerchant({
                storeName: values.storeName,
                description: values.storeDescription,
                totalSeats: values.totalSeats,
                distance: 0,
                cuisineType: values.cuisineType,
                owner: user.id,
                freeSeats: values.totalSeats,
                occupancyRate: 0,
                image: null
              })
            }}
          >
            {({ values, errors, setFieldValue, isSubmitting }) => (
              <Form>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:space-x-4 col-gap-4 space-y-2 md:grid-cols-2 xl:grid-cols-2 sm:space-y-0">
                    <Field name="storeName">
                      {({ field, form: { touched, errors }, meta }) => (
                        <Input
                          name={field.storeName}
                          type="text"
                          label="Nome ristorante"
                          isRequired={false}
                          isInvalid={touched.storeName && errors.storeName}
                          invalidText={errors.storeName}
                          {...field}
                        />
                      )}
                    </Field>
                    <Field name="totalSeats">
                      {({ field, form: { touched, errors }, meta }) => (
                        <Input
                          name={field.totalSeats}
                          type="number"
                          label="Numero coperti"
                          isRequired={false}
                          min={0}
                          isInvalid={touched.totalSeats && errors.totalSeats}
                          {...field}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:space-x-4 col-gap-4 space-y-2 md:grid-cols-2 xl:grid-cols-2 sm:space-y-0">
                    <div>
                      <p>Descrizione</p>
                      <textarea
                        className="w-full text-gray-700 border-2 rounded-md border-gray-300 bg-white border-opacity-5 h-24 min-h-24"
                        value={values.storeDescription}
                        onChange={(e) => {
                          setFieldValue('storeDescription', e.target.value)
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    variant="primary"
                  >
                    CONFERMA
                  </Button>

                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Dialog>
    </>
  )
}

Profile.getInitialProps = async (context) => {
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

      await reduxStore.dispatch(getUserPrenotations(idCurrentUser))

      return {
        //prenotations,
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

export default Profile