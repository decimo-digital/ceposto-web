import React, { useEffect } from 'react'

// Redux imports
import { useStore } from 'state/store'
import { Provider } from 'react-redux'

// Nextjs imports
import Router from 'next/router'
import Head from 'next/head'

// Misc module imports
import NProgress from 'nprogress'

// Styles import
import 'styles/tailwind.css'
import '@reach/dialog/styles.css'
import 'styles/spinner.css'
import 'styles/stripeCardInput.css'
import 'styles/reach-ui-override.css'
import 'react-day-picker/lib/style.css'
import 'styles/daypicker-override.css'
import 'styles/break.css'
import 'styles/break-edge.css'
import 'styles/nprogress.css'

import Layout from 'components/Layout'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function App({ Component, pageProps, router }) {
  const store = useStore(pageProps.initialReduxState)

  const hasLoggedIn =
    router.route !== '/' &&
    router.route !== '/signup' &&
    router.route !== '/forgottenPassword' &&
    router.route !== '/recoverPassword' &&
    router.route !== '/assignMerchant' &&
    router.route !== '/contract'

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Provider store={store}>
        {hasLoggedIn ? (
          <Layout>
            <Component {...pageProps} key={router.route} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider>
    </>
  )
}
