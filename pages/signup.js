import { useDispatch, useStore } from 'react-redux'
import { userLogin } from 'state/auth/actions'
import Link from 'next/link'
import Head from 'next/head'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Router, useRouter } from 'next/router'
import { sha256 } from 'js-sha256'
import { AnimatePresence } from 'framer-motion'

import Container from 'components/Container'

import PhaseZero from 'components/signup/PhaseZero'
import PhaseOneP from 'components/signup/PhaseOneP'
import PhaseOne from 'components/signup/PhaseOne'
import PhaseTwo from 'components/signup/PhaseTwo'
import PhaseThree from 'components/signup/PhaseThree'
import PhaseFour from 'components/signup/PhaseFour'

import Progress from 'components/Progress'

import { isValidEmail, isValidPassword, isValidOtpCode } from 'utils/validation'
import { getErrorMessage } from 'utils/errors'

import { unitScopes, otpTypes, paymentModes } from 'utils/enums'
import axiosRes, { axiosAuth, axiosUsers } from 'utils/axiosInstance'
import isObjectEmpty from 'utils/isObjectEmpty'
import { addUnit } from 'state/units/actions'
import jsCookie from 'js-cookie'

const { isValidPhoneNumber } = require('libphonenumber-js')

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

  function onSuccesfullRegistration(nome) {
    setAlert({
      type: 'success',
      title: 'Complimenti!',
      body: `Benvenuto ${nome}, hai completato correttamente la registrazione! \n 
      Utilizza le tue credenziali per accedere`,
      animate: true
    })
    Router.push('/')
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

          const registrationResponse = await axiosAuth.post(
            '/register',
            data
          )

          if (registrationResponse.status === 200) {
            setAlert({})
            onSuccesfullRegistration()
          }
        } catch (err) {

          setAlert({
            type: 'error',
            title: 'Qualcosa è andato storto',
            body: 'Si prega di riprovare tra qualche minuto',
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
