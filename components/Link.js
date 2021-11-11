import { route } from 'next/dist/next-server/server/router'
import Link from 'next/link'
import { useRouter } from 'next/router'

const CustomLink = props => {
  const router = useRouter()

  return (
    <Link href={props.pathname}>
      <a
        className={`
          sm:border-l-0 sm:border-t-4
          sm:-mt-px flex h-full w-full pt-4 sm:pt-2 px-6 sm:px-4 pb-3
          sm:justify-center items-center
          text-left sm:inline border-b sm:border-b-0 ${
            router.pathname.split('/')[1] ===
            props.pathname.split('?')[0].split('/')[1]
              ? 'text-green-500 bg-white sm:border-green-500'
              : 'sm:border-transparent'
          }`}
      >
        {props.children}
      </a>
    </Link>
  )
}

export default CustomLink
