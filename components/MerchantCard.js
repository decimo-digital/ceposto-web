
import Input from 'components/Input'

const MerchantCard = ({ id, entity_id, name, description, image, price, ean, handleChange }) => {
  return (
    // <div className={`grid cols- rounded overflow-hidden border w-full ${inStock ? 'bg-white' : 'bg-gray-200'} items-end`}>
    //   <img className="flex w-1/2 items-start bg-cover" src={`${image}`} />
    //   <div className="flex px-3 pb-2">
    //     <div className="flex pt-2 space-between">
    //       <span className="flex text-sm text-black-400 text-xl font-black">
    //         {name}
    //       </span>
    //     </div>
    //     <div className="flex pt-1">

    //     </div>

    //   </div>
    // </div>




    <div class="pt-2 pb-6 ">
      <div id="card" class="">

        <div class="container w-100 lg:w-4/5 mx-auto flex flex-col">

          <div v-for="card in cards" class="flex flex-col md:flex-row overflow-hidden
                                     bg-gray-300 rounded-lg shadow-xl  mt-4 w-100 mx-2">

            <div class="h-64 w-auto md:w-1/2">
              <img class="inset-0 h-full w-full object-cover object-center" src={`${image}`} />
            </div>

            <div class="w-full py-4 px-6 text-gray-800 flex flex-col justify-between">
              <h3 class="font-semibold text-lg leading-tight truncate">{name}</h3>
              <p class="mt-2">
                {description}
              </p>
              <p class="text-sm text-gray-700 uppercase tracking-wide font-semibold mt-2">
                prenota
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MerchantCard