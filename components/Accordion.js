import dayjs from "dayjs"
import { useState, useEffect } from "react"
import Icon, { icons } from 'components/Icon'
import Button from "./Button"
import Card from "./Card"
import currencyFormatter from "utils/currencyFormatter"

const Accordion = ({ name, items }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [cancelText, setCancelText] = useState('Annulla acquisto')
  const mappedDetails = new Map()

  return (
    <>
      <div className="w-full">
        <>
          <Card className={`${isOpen ? 'border-t border-r border-l rounded-t rounded-b-none' : ' mb-4'}`}>
            <div className='grid grid-cols-4'>
              <div className='my-auto'>
                <label className="flex p-4 leading-normal cursor-pointer" onClick={() => { setIsOpen(!isOpen) }}>
                  <div className='flex font-bold'>{name}</div>
                  <div className='ml-2'>
                    {
                      isOpen
                        ? <Icon name={icons.CHEVRON_UP} />
                        : <Icon name={icons.CHEVRON_DOWN} />
                    }
                  </div>
                </label>

              </div>
              {/* <div className='my-auto'>
                <label className="flex p-4 leading-normal cursor-pointer" onClick={() => { setIsOpen(!isOpen) }}>
                  porcoddio
                </label>

              </div>

              <div className='my-auto'>
                ciau
              </div>
              <div className='flex items-center'>
                <label className="p-4 text-left">
                  zao
                </label>
              </div> */}
            </div>
          </Card>
          {
            isOpen
              ? <Card className='border-b border-r border-l rounded-t-none rounded-b-md mb-4 bg-gray-200 overflow-y-auto h-32'>
                {items.length > 0
                  ?
                  items.map(
                    item => {
                      return <div className='grid grid-cols-2 p-1'>
                        <div> {item.name}</div>
                        <div> {currencyFormatter(item.price)} €</div>
                      </div>
                    }
                  )
                  : `Non sono presenti ${name.toLowerCase()} in questo menu.`
                }
              </Card>
              : ''
          }
        </>
      </div>

    </>

  )
}

export default Accordion