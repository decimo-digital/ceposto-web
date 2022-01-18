import React from "react";
import Icon, { icons } from "./Icon";
import Link from 'next/link'

export default function Navbar({ userId, userIsMerchant }) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-black">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              href="/home"
            >
              CePosto
            </a>

            <button
              className={`
              text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none
              `}
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars">
                <Icon
                  name={icons.HAMBURGER}
                />
              </i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow justify-end" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {
                userIsMerchant
                  ? <li className="nav-item">
                    <Link href={`/manage/${userId}`}>
                      <a
                        className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                      >
                        <i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i>
                        <span className="ml-2">
                          {
                            navbarOpen
                              ? 'Gestore'
                              : 'Gestore'
                            //  : <Icon name={icons.MANUAL} />
                          }
                        </span>
                      </a>
                    </Link>
                  </li>
                  : ''
              }
              <li className="nav-item">
                <Link href={`/home`}>
                  <a
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  >
                    <i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i>
                    <span className="ml-2">
                      {
                        navbarOpen
                          ? 'Ristoranti'
                          : 'Ristoranti'
                        //  : <Icon name={icons.MANUAL} />
                      }
                    </span>
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href={`/profile/${userId}`}>
                  <a
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  >
                    <i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i>
                    <span className="ml-2">
                      {
                        navbarOpen
                          ? 'Profilo'
                          : 'Profilo'
                        // : <Icon name={icons.USER} />
                      }
                    </span>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
