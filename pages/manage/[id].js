import { useEffect, useState } from 'react'
import nextCookie from 'next-cookies'
import { initializeStore } from 'state/store'
import Router from 'next/router'
import { checkToken } from 'utils/checkToken'
import initStore from 'state/initStore'
import { userLogout } from 'state/auth/actions'
import Head from 'next/head'
import Dialog from 'components/Dialog'
import { axiosPrenotation, axiosMenu, axiosUsers } from 'utils/axiosInstance'
import { useSelector, useDispatch } from 'react-redux'
import MerchantCard from 'components/MerchantCard'
import BookCard from 'components/BookCard'
import Button from 'components/Button'
import { Field, Form, Formik, isObject } from 'formik'
import Input from 'components/Input'
import { addEmptyItemMenu, addMerchant, getMerchants } from 'state/units/actions'
import AlertFloat from 'components/AlertFloat'
import isObjectEmpty from 'utils/isObjectEmpty'
import MenuCard from 'components/MenuCard'
import { getMenu } from 'state/units/actions'
import InputBook from 'components/InputBook'
import { getMerchantPrenotations, updatePrenotation } from 'state/prenotations/actions'
const Manage = (props) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const myMerchants = props.merchants
  const [alert, setAlert] = useState(false)
  const [isOpenBookDialog, setIsOpenBookDialog] = useState(false)
  const [isOpenMenuDialog, setIsOpenMenuDialog] = useState(false)
  const [isOpenAddMerchantDialog, setIsOpenAddMerchantDialog] = useState(false)
  const [merchantInManage, setMerchantInManage] = useState({
    id: -1,
    storeName: '',
    cuisineType: '',
    description: '',
    enabled: true,
    freeSeats: 0,
    occupancyRate: 0,
    owner: -1,
    totalSeats: 0,
  })
  const prenotations = useSelector(state => state.prenotations?.prenotations)
  const [isAddingItemToMenu, setIsAddingItemToMenu] = useState(false)
  let [newItems, setNewItems] = useState([])
  const [isOpenPrenotationPatchDialog, setIsOpenPrenotationPatchDialog] = useState(false)
  const [selectedMerchant, setSelectedMerchant] = useState({})
  const [requestingSeats, setRequestingSeats] = useState(1)
  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const [selectedPrenotation, setSelectedPrenotation] = useState(0)
  const [selectedPrenotationDate, setSelectedPrenotationDate] = useState(0)
  const menu = useSelector(state => state.merchants.menu)


  async function onErrorDismiss(name, id) {
    setAlert({
      type: 'error',
      title: 'Qualcosa è andato storto',
      body: 'Riprova tra qualche minuto',
      animate: true
    })
  }

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
      setIsOpenPrenotationPatchDialog(false)
    } catch (error) {
      console.log(error)
      setIsOpenPrenotationPatchDialog(false)
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

  useEffect(() => {
    setRequestingSeats(selectedMerchant.amount)
  }, [selectedMerchant])

  const openUpdate = (merchant, bookId, bookDate) => {
    setSelectedPrenotation(bookId)
    setSelectedPrenotationDate(bookDate)
    setSelectedMerchant(merchant)
    setIsOpenPrenotationPatchDialog(true)

  }

  // const getPrenotation = async ({ merchantId }) => {
  //   const { data: prenot } = await axiosPrenotation.get(
  //     `/${merchantId}/prenotations`,
  //     { headers: { 'access-token': props.token } }
  //   )

  //   setPrenotations(prenot)
  // }

  const getMenuInPlace = async ({ merchantId }) => {
    try {

      await dispatch(getMenu(merchantId, true))
    } catch (error) {
      console.error(error)
      setAlert({
        type: 'error',
        title: 'Qualcosa è andato storto',
        body: 'Si prega di riprovare tra qualche minuto',
        animate: true
      })
    }
  }

  const addNewMerchant = async (merchantInfos) => {
    try {
      await dispatch(addMerchant(merchantInfos))
      myMerchants.push(merchantInfos)
      setAlert({
        type: 'success',
        title: ` ${merchantInfos.storeName} inserito correttamente!`,
        body: `Completa la configurazione del tuo ristorante aggiungendo un menu`

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

  const addMenuItem = async (values, sele, merchantId) => {
    try {
      await axiosMenu.post(
        `/${merchantId}`, {
        name: values.name,
        price: values.price,
        categoryId: sele,
        merchantId
      },
        { headers: { 'access-token': props.token } }
      )
      setAlert({
        type: 'success',
        title: `Piatto aggiunto correttamente!`,
      })
      return 1
    } catch (error) {
      console.error(error)
      setAlert({
        type: 'error',
        title: 'Qualcosa è andato storto',
        body: 'Si prega di riprovare tra qualche minuto',
        animate: true
      })

    }
  }

  const updateMenuItem = async (values, sele, merchantId) => {
    try {
      await axiosMenu.patch(
        `/${merchantId}`, {
        menuItemId: values.id,
        name: values.name,
        price: values.price,
        categoryId: sele,
        merchantId
      },

        { headers: { 'access-token': props.token } }
      )
      setAlert({
        type: 'success',
        title: `Piatto aggiornato correttamente!`,
      })
    } catch (error) {
      console.error(error)
      setAlert({
        type: 'error',
        title: 'Qualcosa è andato storto',
        body: 'Si prega di riprovare tra qualche minuto',
        animate: true
      })
    }
  }

  const deleteMenuItem = async (id, merchantId) => {
    try {
      await axiosMenu.delete(
        `/${merchantId}/${id}`,
        { headers: { 'access-token': props.token } }
      )
      setAlert({
        type: 'success',
        title: `Piatto eliminato correttamente!`,
      })
      return 1
    } catch (error) {
      console.error(error)
      setAlert({
        type: 'error',
        title: 'Qualcosa è andato storto',
        body: 'Si prega di riprovare tra qualche minuto',
        animate: true
      })
    }
  }



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
              <div className='flex text-3xl items-center'>
                <div className='ml-auto m-2'>I miei ristoranti</div>
                <div className='mr-auto ml-0'>
                  <Button
                    onClick={() => { setIsOpenAddMerchantDialog(true) }}
                    variant={'primary'}
                  >+</Button></div>

              </div>
              <div>
                {
                  myMerchants.map(
                    (merchant) => {
                      return <MerchantCard
                        id={merchant.id}
                        name={merchant.storeName}
                        description={''}
                        image={merchant.image}
                        type={'short'}
                        isFromMenage={true}
                        onClick={async () => {
                          //await getPrenotation({ merchantId: id })
                          await dispatch(getMerchantPrenotations(merchant.id))
                          setMerchantInManage(merchant)
                          setIsOpenBookDialog(true)
                        }}
                        onClickMenu={
                          async () => {
                            setMerchantInManage(merchant)
                            await getMenuInPlace({ merchantId: merchant.id })
                            setIsOpenMenuDialog(true)
                          }
                        }
                      />
                    }
                  )
                }
              </div>
            </div>

          </div>
        </div>
      </div>

      <Dialog
        isOpen={isOpenBookDialog}
        handleDismiss={() => {
          setIsOpenBookDialog(false)
        }}
        type='prenotation'
      >
        <div className="mt-4 space-y-8">
          <h2 className='font-medium text-2xl text-gray-500'>
            Prenotazioni di {merchantInManage.name}
          </h2>
          {typeof prenotations !== 'undefined' && prenotations.length > 0
            ? prenotations
              .sort((a, b) => a.valid < b.valid)
              .map(
                book => {
                  return (
                    <BookCard
                      id={book.id}
                      name={merchantInManage.storeName}
                      dateOfPrenotation={book.dateOfPrenotation}
                      amount={book.amount}
                      valid={book.valid}
                      enabled={book.enabled}
                      merchant={merchantInManage}
                      token={props.token}
                      onSuccessfullDismiss={onSuccessfullDismiss}
                      onErrorDismiss={onErrorDismiss}
                      setisopen={openUpdate}
                    />
                  )
                }
              )
            : <div>Non sono presenti prenotazioni.</div>
          }
        </div>
      </Dialog>

      <Dialog
        isOpen={isOpenMenuDialog}
        handleDismiss={() => {
          setIsAddingItemToMenu(false)
          setNewItems([])
          setIsOpenMenuDialog(false)
        }}
        type='menu'
      >
        <div className="mt-4 space-y-8 max-h-fit overflow-auto">

          <div className='flex text-3xl items-center'>
            <h2 className='font-medium text-2xl text-gray-500'>
              Menu di {merchantInManage.storeName}
            </h2>
            <div className='mr-auto ml-4'>
              <Button
                onClick={async () => {
                  setNewItems(newItem => [...newItem, 1])
                  setIsAddingItemToMenu(true)
                }}
                variant={'primary'}
              >+</Button></div>
          </div>
          {(typeof menu !== 'undefined' && (menu.items).length > 0) || isAddingItemToMenu
            ? <>
              {
                isAddingItemToMenu && (
                  newItems.
                    map(
                      newItem => {
                        return (
                          <MenuCard
                            id={-1}
                            name={''}
                            price={0}
                            categoryId={1}
                            updateMenuItem={updateMenuItem}
                            deleteMenuItem={deleteMenuItem}
                            addMenuItem={addMenuItem}
                            merchantId={merchantInManage.id}
                          />
                        )
                      }
                    )
                )
              }
              {
                menu?.items
                  .sort((a, b) => a.categoryId >= b.categoryId)
                  .map(
                    item => {
                      return (
                        <MenuCard
                          id={item.menuItemId}
                          name={item.name}
                          price={item.price}
                          categoryId={item.categoryId}
                          updateMenuItem={updateMenuItem}
                          deleteMenuItem={deleteMenuItem}
                          merchantId={item.merchantId}
                        />
                      )
                    }
                  )
              }
            </>
            : <div>
              <p>Non sono presenti menu. </p>
              <p>Aggiungi piatti utilizzando il tasto '+'</p>
            </div>
          }
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
            Aggiungi ristorante
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
                occupancyRate: 0
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

      <Dialog
        isOpen={isOpenPrenotationPatchDialog}
        handleDismiss={() => { setIsOpenPrenotationPatchDialog(false) }}
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
      const { data: merchants } = await axiosUsers.get('/merchants',
        { headers: { 'access-token': token } })

      return {
        merchants,
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