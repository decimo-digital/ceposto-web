import Head from 'next/head'
import axios from 'axios'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import nextCookie from 'next-cookies'

import { useState } from 'react'
import { useDispatch } from 'react-redux'

import Alert from 'components/Alert'
import Button from 'components/Button'
import Container from 'components/Container'
import Input from 'components/Input'

import isObjectEmpty from 'utils/isObjectEmpty'
import { isValidEmail, isValidPassword } from 'utils/validation'
import { axiosAuth } from 'utils/axiosInstance'

import { userLogin, userLogout } from 'state/auth/actions'

import { signIn, signOut, useSession, getCsrfToken, getSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'

const Index = () => {
  const [alert, setAlert] = useState({})
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const { data: session } = useSession()


  const [fields, setFields] = useState({
    username: { value: '', invalid: false },
    password: { value: '', invalid: false }
  })

  const dispatch = useDispatch()

  const router = useRouter()

  const { registrationEnded, passwordRecovered } = router.query

  async function handleLogin(e) {
    e.preventDefault()
    setAlert({})
    if (
      isInputInvalid('username', fields.username.value) ||
      isInputInvalid('password', fields.password.value)
    ) {
    } else {
      setIsLoggingIn(true)
      setAlert({})
      const data = {
        username: fields.username.value,
        password: fields.password.value
      }

      try {
        //console.log(data)
        const response = await axiosAuth.post('/login', data)

        const { accessToken } = response.data

        await Promise.all([
          dispatch(userLogin(accessToken, fields.username.value)),
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
        setIsLoggingIn(false)
      }
    }
  }

  function handleFieldChange(e) {
    setAlert({})
    const field = e.target.id
    const value = e.target.value

    setFields((fields) => {
      return {
        ...fields,
        [field]: { ...fields[field], invalid: false, value }
      }
    })
  }

  function isInputInvalid(field, value) {
    let invalid = false

    switch (field) {
      case 'username':
        invalid = !isValidEmail(value)
        break
      case 'password':
        invalid = !isValidPassword(value)
        break
    }

    setFields((fields) => {
      return {
        ...fields,
        [field]: { ...fields[field], value, invalid }
      }
    })

    return invalid
  }

  function handleFieldBlur(e) {
    setAlert({})
    const field = e.target.id
    const value = e.target.value

    isInputInvalid(field, value)
  }

  return (
    <>
      <Head>
        <title>CePosto | Accedi</title>
      </Head>
      <div className="flex flex-col items-center justify-center w-screen min-h-screen space-y-4 bg-black">
        <Container>
          <div className="flex flex-col h-auto max-w-md mx-auto">
            <img
              src=""
              className="h-40 p-4 text-white text-center"
              alt="Logo CePosto"
            />
            <div className="flex flex-col h-auto bg-white rounded-md shadow-md">
              {false ? (
                <>
                  I nostri server sono attualmente in manutenzione, ci scusiamo
                  per il disagio e La preghiamo di ritentare più tardi.
                </>
              ) : (
                <div className="px-4 py-8 space-y-8 sm:px-12 ">
                  {!isObjectEmpty(alert) && <Alert {...alert} />}
                  <form
                    className="flex flex-col space-y-8"
                    onSubmit={handleLogin}
                  >
                    <Input
                      label="Nome utente"
                      isRequired={true}
                      isInvalid={fields.username.invalid}
                      invalidText="Inserire un nome utente valido"
                      type="email"
                      value={fields.username.value}
                      onChange={(e) => handleFieldChange(e)}
                      onBlur={(e) => handleFieldBlur(e)}
                      id="username"
                    />
                    <Input
                      label="Password"
                      type="password"
                      isRequired={true}
                      isInvalid={fields.password.invalid}
                      invalidText="Inserire una password valida"
                      value={fields.password.value}
                      onChange={(e) => handleFieldChange(e)}
                      onBlur={(e) => handleFieldBlur(e)}
                      id="password"
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth={true}
                      onClick={(e) => handleLogin(e)}
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? 'Accesso in corso...' : 'Entra'}
                    </Button>
                  </form>

                  <Link href="/signup">
                    <Button type="button" fullWidth={true} variant="primary">
                      Registrati ora
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
        {/* <Button
          variant={'destructive'}
          onClick={async () => {
            await axios.get(
              'http://localhost:6969/api/merchants'
            )
          }}>

        </Button> */}
        <Button
          onClick={async () => {
            // const response = await axiosAuth.post('/google', "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..y6JxOZ-8dKMVS9eC.p-mwKD2RmzkU38wMgXbqxqRxyvLj0RqDL-SRzTP9L1OYInchTEz8K03YFd0uOvQ-4plsZqtA8lfmxl2nClwPCVZxvYDFmD6jx1Xo2aX_L4kKTu3wF8jZmr0aSbM3XlaheS0f7ahap1ezU3wDahiKitWyXRd8THe8ziADR3ga_6Op2VSLaywLIawx79fu69vIYgxxa3Z_wpC_oMn8Oz0PUj9UbGsxjBqA3msTbySF4Z9ef0lbDgGIdj7SBkwKJDXL6WOEPopTkkvVj9mRYqE-jWIGEG3nxtaCDFUBPUzUDVmdR_qvNZLdvrDetvJnqGQcxazgek0A7PWvs3EFOJlQ0NOUNTVYDy9Zo9Apkg.ZcDXglWnm65KhPfEJGRkSQ")
            // console.log(response)
            await signIn("google", { redirect: false })

          }}
        >
          googleAuth
        </Button>
      </div>
    </>
  )
}

Index.getInitialProps = async (ctx) => {
  const { token } = nextCookie(ctx)
  const { reduxStore, res } = ctx



  if (typeof token !== 'undefined') {
    try {
      let redirectPage = ''
      let redirectPageAs = ''

      redirectPage = '/'
      redirectPageAs = '/'

      if (typeof window !== 'undefined') {
        Router.push(redirectPage, redirectPageAs)
      } else {
        res.writeHead(302, { Location: redirectPageAs })

        res.end()
      }
    } catch (err) {
      console.error(err)

      if (
        err?.response?.status === 500 &&
        err?.response?.data?.message === 'Impossibile autenticare Token'
      )
        reduxStore.dispatch(userLogout())
    }
  }

  return {}
}

export default Index
