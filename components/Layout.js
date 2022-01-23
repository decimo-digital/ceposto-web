import Head from 'next/head'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { useRouter } from 'next/router'

import NavLink from 'components/NavLink'

import { useState, useEffect } from 'react'

import Navbar from 'components/Navbar'

const selectCurrUnitIndex = createSelector(
  (state) => state.currentUnitIndex || 0,
  (currentIndex) => currentIndex
)

function Layout({ children, title = 'CePosto' }) {
  const currUnitIndex = useSelector(selectCurrUnitIndex)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const router = useRouter()

  const user = useSelector((state) => state?.user)

  const isMerchantFromRegistration = useSelector((state) => state?.isMerchant)

  useEffect(() => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false)
  }, [router.route])

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0]
    body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto'
  }, [isMobileMenuOpen])

  let hasToken = typeof router.query.token !== 'undefined'

  const links = (
    <>
      <NavLink
        pathname={`/`}
        text={`CePosto`}
      />

      <NavLink
        pathname={`/profile/${user.id}`}
        text={`Profilo`}
      />

      <NavLink
        pathname={`/manage/${user.id}`}
        text={`Ristoranti`}
      />
    </>
  )

  return (
    <div className="font-sans">
      <Head>
        <title>{title}</title>
      </Head>

      <div className="flex min-h-screen">
        <div className="flex flex-col w-full relative">
          <header className="bg-black sticky top-0 z-10">


            <Navbar userId={user.id} userIsMerchant={isMerchantFromRegistration || user.merchant} />
          </header>
          <main className="w-full h-full bg-gray-100">
            <div className="grid">{children}</div>
          </main>
          <footer className="bg-gray-200 p-4">
            <div className="flex flex-col justify-between text-gray-700 sm:flex-row sm:px-0">
              <span>
                &#0169; 2021-{new Date().getFullYear()} Decimo S.r.l.
              </span>
              <ul className="flex flex-col sm:flex-row">

              </ul>
            </div>
          </footer>
        </div>
      </div>

      {/* <div className="flex min-h-screen">
        <div className="flex flex-col w-full relative">
          <header className="bg-black sticky top-0 z-10">

            <nav className="flex h-full bg-black border-black-200 sm:flex space-between">
              {links}
            </nav>
          </header>
          <main className="w-full h-full bg-gray-100">
            <div className="grid">{children}</div>
          </main>
          <footer className="bg-gray-200 p-4">
            <div className="flex flex-col justify-between text-gray-700 sm:flex-row sm:px-0">
              <span>
                &#0169; 2021-{new Date().getFullYear()} Decimo S.r.l.
              </span>
              <ul className="flex flex-col sm:flex-row">

              </ul>
            </div>
          </footer>
        </div>
      </div> */}
    </div>
  )
}

export default Layout
