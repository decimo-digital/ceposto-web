import Link from 'next/link'
import { useSelector } from 'react-redux'
import Icon, { icons } from './Icon'

const SidebarItem = (props) => {
  const {
    pathname,
    name,
    hasAction,
    onItemClick,
    onActionClick,
    icon,
    scopeId
  } = props

  const currentUnitIndex = useSelector((state) => state.currentUnitIndex)

  return (
    <div
      className={`cursor-pointer ${
        pathname.includes(currentUnitIndex)
          ? 'bg-green-800 text-white'
          : 'bg-white text-green-800'
      } flex items-center border rounded-md p-2 gap-2`}
    >
      {icon && (
        <span className="">
          <Icon
            name={icon}
            color={{ primary: 'text-green-200', secondary: 'text-green-400' }}
          />
        </span>
      )}
      {scopeId && (
        <span className="">
          <img src={`/registration/${scopeId}.svg`} width="28" height="28" />
        </span>
      )}
      <Link href={pathname}>
        <a
          onClick={onItemClick}
          className="flex-grow overflow-ellipsis overflow-hidden"
        >
          {name}
        </a>
      </Link>
      {hasAction && (
        <button className="flex-none" onClick={onActionClick}>
          <Icon
            name={icons.TRASH}
            color={{ primary: 'text-red-200', secondary: 'text-red-400' }}
          />
        </button>
      )}
    </div>
  )
}

export default SidebarItem
