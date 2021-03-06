import dayjs from 'dayjs'
import { axiosPrenotation } from 'utils/axiosInstance'
import Button from './Button'
const BookCard = ({ id, name, dateOfPrenotation, amount, valid, enabled, merchant, token, onSuccessfullDismiss, onErrorDismiss, setisopen }) => {
  const bookId = id
  const bookPrenotation = dateOfPrenotation
  const dismissPrenotation = async () => {
    try {
      await axiosPrenotation.delete(
        `/${bookId}`,
        { headers: { 'access-token': token } }
      )
      onSuccessfullDismiss(id, name)
    } catch (error) {
      console.error(error)
      onErrorDismiss()
    }
  }

  return (
    <div className="pt-2 pb-6 ">
      <div id="card" className="">

        <div className="container w-100 lg:w-4/5 mx-auto flex flex-col">

          <div v-for="card in cards" className={`flex flex-col md:flex-row overflow-hidden
                                          rounded-lg shadow-xl  mt-4 w-100 mx-2
                                          ${enabled && valid
              ? 'bg-green-100'
              : 'bg-red-200'
            }
                                          `}>

            <div className="w-full py-4 px-6 text-gray-800 flex flex-col justify-between">
              <h3 className="font-semibold text-lg leading-tight truncate">{name}</h3>
              <p className="mt-2">
                Posti prenotati: {amount}
              </p>
              <p className="mt-2">
                Data: {dayjs(dateOfPrenotation).format('DD-MM-YYYY')}
              </p>
              <p className="mt-2">
                Ora: {dayjs(dateOfPrenotation).format('HH:mm:ss')}
              </p>
              <p className="text-sm text-gray-700 uppercase tracking-wide font-semibold mt-2">
              </p>
            </div>
            {
              (enabled && valid) && (
                <div className='grid grid-rows-2'>
                  <Button variant='primary'
                    noRoundDown={true}
                    onClick={() => { setisopen({ ...merchant, amount }, bookId, bookPrenotation) }}
                  >
                    Modifica
                  </Button>

                  <Button
                    variant='refuse'
                    noRoundTop={true}
                    onClick={dismissPrenotation}
                  >Annulla</Button>
                </div>

              )
            }
          </div>
        </div>
      </div>
    </div>

  )


}

export default BookCard