import { useEffect, useState } from 'react'
import axiosResources from 'utils/axiosInstance'
import Dialog from './Dialog'
import Icon, { icons } from './Icon'

const options = [
  {
    name: 'Da comunicare',
    color: 'bg-yellow-100',
    status: null,
    iconColors: { primary: 'text-yellow-300', secondary: 'text-yellow-800' },
  },
  {
    name: 'Presente',
    color: 'bg-green-100',
    status: 'P',
    iconColors: { primary: 'text-green-300', secondary: 'text-green-800' },
  },
  {
    name: 'Assente',
    color: 'bg-red-100',
    status: 'A',
    iconColors: { primary: 'text-red-300', secondary: 'text-red-800' },
  },
]

function UserPresenceSelect(props) {
  const [selectedIndex, setSelectedIndex] = useState(
    options.findIndex(option => option.status === props.presence)
  )
  const [bgColor, setBgColor] = useState('bg-yellow-100')

  const [
    showPresenceSelectionDialog,
    setShowPresenceSelectionDialog,
  ] = useState(false)
  const openPresenceSelectionDialog = () => setShowPresenceSelectionDialog(true)
  const closePresenceSelectionDialog = () =>
    setShowPresenceSelectionDialog(false)

  useEffect(() => {
    closePresenceSelectionDialog()

    getBgColor()
  }, [selectedIndex])

  function getBgColor(i = selectedIndex) {
    let newBgColor = ''
    switch (i) {
      case 0:
        newBgColor = 'bg-yellow-100'
        break
      case 1:
        newBgColor = 'bg-green-100'
        break
      case 2:
        newBgColor = 'bg-red-100'
        break
    }

    setBgColor(newBgColor)
  }

  useEffect(() => {
    ;(async () => {
      if (options[selectedIndex].status !== props.presence) {
        if (options[selectedIndex].status != null) {
          await axiosResources.patch(
            `/users/${props.userId}/presence`,
            {
              presence: options[selectedIndex].status,
              datetime: props.datetime,
            },
            { headers: { 'x-access-token': props.token } }
          )
        } else {
          try {
            await axiosResources.post(
              `/users/${props.userId}/presence`,
              {
                presence: options[selectedIndex].status,
                datetime: props.datetime,
              },
              { headers: { 'x-access-token': props.token } }
            )
          } catch (err) {
            console.error(err)
          }
        }
      }
    })()
  }, [bgColor])

  return (
    <>
      <Dialog
        aria-label='Employee presence selection'
        isOpen={showPresenceSelectionDialog}
        handleDismiss={closePresenceSelectionDialog}
      >
        <h2 className='text-2xl font-bold'>Modifica la presenza</h2>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4'>
          {options.map((option, i) => {
            return (
              <button
                onClick={() => setSelectedIndex(i)}
                className={`${option.color} rounded-full px-3 py-2 flex justify-between`}
                key={i}
              >
                {option.name}
                {selectedIndex === i && (
                  <Icon name={icons.CHECK} color={option.iconColors} />
                )}
              </button>
            )
          })}
        </div>
      </Dialog>

      <div className='relative w-full'>
        <span className='inline-block w-full rounded-full shadow-sm '>
          <button
            type='button'
            aria-haspopup='listbox'
            aria-expanded='true'
            aria-labelledby='listbox-label'
            onClick={() => openPresenceSelectionDialog()}
            className={`
              cursor-default 
              relative w-full 
              rounded-full border border-gray-300
              bg-white pl-3 pr-10 py-2 
              text-left focus:outline-none focus:shadow-outline-blue 
              focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${bgColor}`}
          >
            <div className='flex items-center space-x-3'>
              <span className='block truncate'>
                {options[selectedIndex].name}
              </span>
            </div>
            <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
              <Icon name={icons.CHEVRON_DOWN} />
            </span>
          </button>
        </span>
      </div>
    </>
  )
}

export default UserPresenceSelect
