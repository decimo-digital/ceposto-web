import Icon, { icons } from './Icon'

import { useDispatch, useSelector } from 'react-redux'

import { userLogout } from 'state/auth/actions'
import { useRouter } from 'next/router'

import UnitsSidebar from 'components/UnitsSidebar'

function Aside() {
  const dispatch = useDispatch()
  const router = useRouter()

  const user = useSelector((state) => state.user)

  const units = useSelector((state) => state.units.data)

  function handleLogout(e) {
    e.preventDefault()
    dispatch(userLogout())
    router.push('/')
  }

  return (
    <aside className="flex flex-col justify-between p-4 max-h-screen min-w-min sticky left-0 top-0 space-y-4 overflow-y-hidden items-center">
      <img
        src="/toduba-logo-large.svg"
        alt="Logo Toduba"
        className="flex-none sticky top-0 max-w-xs"
      />
      <div className="p-2 border-2 bg-gray-300 w-full rounded-md">
        <p className="text-center font-bold w-full">{user.username}</p>
      </div>
      <div className="w-full flex-grow overflow-y-auto">
        <UnitsSidebar
          canAddUnits={true}
          isEmptyUnits={units?.length < 1 ?? true}
        />
      </div>
      <button
        className="flex p-2 w-full flex-none hover:bg-gray-100 rounded-md"
        onClick={handleLogout}
      >
        <Icon name={icons.LOGOUT} />
        <p className="pl-2">ESCI</p>
      </button>
    </aside>
  )
}

export default Aside
