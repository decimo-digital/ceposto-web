import Link from 'next/link'
import { useRouter } from 'next/router'

const NavLink = ({ text, pathname }) => {
  const router = useRouter()

  return (
    <div className="flex">
      <span
        className={`block sm:hidden px-4 border-b cursor-pointer ${router.pathname.split('/')[1] === pathname.split('?')[0].split('/')[1]
          ? 'bg-yellow-400'
          : 'bg-transparent'
          }`}
      ></span>
      <Link href={pathname}>
        <a
          className={`
          sm:border-l-0 sm:border-b-4
          sm:-mt-px flex h-full w-full pt-4 sm:pt-2 px-6 sm:px-4 pb-3
          sm:justify-center items-center
          text-left sm:inline border-b ${router.pathname.split('/')[1] ===
              pathname.split('?')[0].split('/')[1]
              ? 'text-white bg-black sm:border-black'
              : 'sm:border-transparent'
            }`}
        >
          {text}
        </a>
      </Link>
    </div>
  )
}

export default NavLink
