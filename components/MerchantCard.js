import Link from 'next/link'
const MerchantCard = ({ id, name, description, image, type }) => {
  console.log(id, name)
  switch (type) {
    case 'full':
      return (
        <div className="pt-2 pb-6 ">
          <div id="card" className="">

            <div className="container w-100 lg:w-4/5 mx-auto flex flex-col cursor-pointer">

              <Link href={`/merchants/${id}`} className='cursor-pointer'>
                <div v-for="card in cards" className="flex flex-col md:flex-row overflow-hidden
                                         bg-gray-300 rounded-lg shadow-xl  mt-4 w-100 mx-2">

                  <div className="h-64 w-auto md:w-1/2">
                    <img className="inset-0 h-full w-full object-cover object-center" src={`${image}`} />
                  </div>

                  <div className="w-full py-4 px-6 text-gray-800 flex flex-col justify-between">
                    <h3 className="font-semibold text-lg leading-tight truncate">{name}</h3>
                    <p className="mt-2">
                      {description}
                    </p>
                    <p className="text-sm text-gray-700 uppercase tracking-wide font-semibold mt-2">
                      prenota
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>


      )

    case 'short':
      return (
        <Link href={`/merchants/${id}`}>
          <div className="p-2">
            <div id="card">
              <div className="container w-100 lg:w-4/5 mx-auto flex flex-col">

                <div v-for="card in cards" className="flex flex-col md:flex-row overflow-hidden
                                         bg-gray-300 rounded-lg shadow-xl w-100">
                  <div className="h-24 w-24 md:w-24">
                    <img className="inset-0 h-full w-full object-cover object-center" src={`${image}`} />
                  </div>

                  <div className="w-full py-4 px-6 text-gray-800 flex flex-col">
                    <h3 className="font-semibold text-lg leading-tight truncate">{name}</h3>
                    <p className="mt-2">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

      )
    default: <></>
  }

}

export default MerchantCard