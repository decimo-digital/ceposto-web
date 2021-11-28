import { useDispatch, useStore } from 'react-redux'
import Link from 'next/link'
import Head from 'next/head'
import { useState, useRef, useEffect, useMemo } from 'react'
import Router, { useRouter } from 'next/router'


import Container from 'components/Container'
import PhaseOne from 'components/signup/PhaseOne'

import { isValidEmail, isValidPassword } from 'utils/validation'

import { axiosAuth } from 'utils/axiosInstance'
import isObjectEmpty from 'utils/isObjectEmpty'
const { isValidPhoneNumber } = require('libphonenumber-js')
import { userLogin } from 'state/auth/actions'

const variants = {
  enter: {
    opacity: 0,
    transform: 'translate3d(100%,0,0)'
  },
  center: {
    opacity: 1,
    transform: 'translate3d(0%,0,0)'
  },
  exit: {
    opacity: 0,
    width: 0,
    height: 0,
    transform: 'translate3d(-50%,0,0)'
  },
  exitCollapse: {
    opacity: 0,
    width: 0,
    height: 0
  },
  enterExpand: {
    opacity: 0
  },
  centerExpand: {
    opacity: 1,
    width: '100%',
    height: '100%'
  }
}

const Signup = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const store = useStore()

  const [currSignupStage, setCurrSignupStage] = useState(-1)
  const [alert, setAlert] = useState({})
  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [token, setToken] = useState('')
  const [fields, setFields] = useState({
    nome: { invalid: false, value: '' },
    cognome: { invalid: false, value: '' },
    email: { invalid: false, value: '' },
    phone: { invalid: false, value: '' },
    password: { invalid: false, value: '' },
    passwordRepeat: { invalid: false, value: '' }
  })

  function handleFieldChange(field, value) {
    setFields((fields) => {
      return {
        ...fields,
        [field]: { ...fields[field], invalid: false, value }
      }
    })
  }

  function changeFieldInvalidStatus(field, invalid) {
    setFields((fields) => {
      return {
        ...fields,
        [field]: { ...fields[field], invalid }
      }
    })
  }

  async function onSuccesfullRegistration(token, email) {
    console.log('Sto facendo la login con ', token)
    try {
      await Promise.all([
        dispatch(userLogin(token, email)),
        router.push('/home')
      ])
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

  async function phaseOneButtonClick(e) {
    e.preventDefault()

    let name = fields.nome.value
    let surname = fields.cognome.value
    let email = fields.email.value.toLowerCase()
    let phone = fields.phone.value
    let password = fields.password.value
    let passwordRepeat = fields.passwordRepeat.value

    changeFieldInvalidStatus('nome', isObjectEmpty(name))
    changeFieldInvalidStatus('cognome', isObjectEmpty(surname))
    changeFieldInvalidStatus('password', isObjectEmpty(password))
    changeFieldInvalidStatus('passwordRepeat', isObjectEmpty(passwordRepeat))

    if (
      !isValidEmail(email) ||
      !isValidPhoneNumber(phone, 'IT') ||
      isObjectEmpty(name) ||
      isObjectEmpty(surname) ||
      !isValidPassword(password)
    ) {
      changeFieldInvalidStatus('email', !isValidEmail(email))
      changeFieldInvalidStatus('phone', !isValidPhoneNumber(phone, 'IT'))
    } else {
      if (password !== passwordRepeat) {
        setAlert({
          type: 'error',
          title: 'Qualcosa è andato storto!',
          body: 'Le due password non combaciano',
          animate: true
        })
      } else if (!isValidPassword(password)) {
        changeFieldInvalidStatus('password', !isValidPassword(password))
      } else {
        setIsSendingRequest(true)
        try {
          const data = {
            id: 0,
            firstName: name,
            lastName: surname,
            phone,
            email,
            password
          }

          const { data: registrationResponse } = await axiosAuth.post(
            '/register',
            data
          )
          const { accessToken } = registrationResponse
          console.log(accessToken)
          if (accessToken) {
            onSuccesfullRegistration(accessToken, email)
          }
        } catch (err) {
          console.error(err.response.status, err.response.data.message)
          setAlert({
            type: 'error',
            title: 'Qualcosa è andato storto',
            body: err.response?.data?.message ?? 'Si prega di riprovare tra qualche minuto'
            ,
            animate: true
          })
        } finally {
          setIsSendingRequest(false)
        }
      }

    }
  }

  return (
    <>
      <Head>
        <title>CePosto | Registrati</title>
      </Head>
      <div className="flex items-center justify-center w-full bg-black">
        <Container>
          <div className="flex flex-col h-auto max-w-md mx-auto text-white">
            <img
              src=""
              className="h-40 p-4"
              alt="Logo CePosto"
            />
          </div>
          <PhaseOne
            alert={alert}
            variants={variants}
            handleSubmit={phaseOneButtonClick}
            fields={fields}
            handleFieldChange={handleFieldChange}
            isSendingRequest={isSendingRequest}
          />

          <div className="w-full p-2 mt-4 text-center text-white bg-transparent focus:underline hover:underline">
            <Link href="/">Torna alla pagina di login</Link>
          </div>
        </Container>
      </div>
    </>
  )
}

export default Signup
