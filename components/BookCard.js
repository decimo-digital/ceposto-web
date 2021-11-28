import dayjs from 'dayjs'
import Button from './Button'
const BookCard = ({ id, name, dateOfPrenotation, amount, valid }) => {
  console.log(dayjs().unix())
  return (
    <div class="pt-2 pb-6 ">
      <div id="card" class="">

        <div class="container w-100 lg:w-4/5 mx-auto flex flex-col">

          <div v-for="card in cards" class={`flex flex-col md:flex-row overflow-hidden
                                          rounded-lg shadow-xl  mt-4 w-100 mx-2
                                          ${valid
              ? 'bg-green-100'
              : 'bg-red-200'
            }
                                          `}>

            <div class="w-full py-4 px-6 text-gray-800 flex flex-col justify-between">
              <h3 class="font-semibold text-lg leading-tight truncate">{name}</h3>
              <p class="mt-2">
                Posti prenotati: {amount}
              </p>
              <p class="mt-2">
                Data: {dayjs(dateOfPrenotation).format('DD-MM-YYYY')}
              </p>
              <p class="mt-2">
                Ora: {dayjs(dateOfPrenotation).format('HH:mm:ss')}
              </p>
              <p class="text-sm text-gray-700 uppercase tracking-wide font-semibold mt-2">
              </p>
            </div>
            {
              valid && (
                <div className='grid grid-rows-2'>
                  <Button variant='primary' noRoundDown={true}>Modifica</Button>

                  <Button variant='refuse' noRoundTop={true}>Annulla</Button>
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