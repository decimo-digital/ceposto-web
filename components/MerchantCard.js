import Link from 'next/link'
const MerchantCard = ({ id, name, description, image, type, isFromMenage = false, onClick, onClickMenu }) => {
  //sample-${id % 10 + Number((Math.random() * 2).toFixed(0))}.jpg
  switch (type) {
    case 'full':
      return (
        <div className="pt-2 pb-6 hover:opacity-80">
          <div id="card" className="">

            <div className="container w-100 lg:w-4/5 mx-auto flex flex-col cursor-pointer">

              <Link href={`/merchants/${id}`} className='cursor-pointer'>
                <div v-for="card in cards" className="flex flex-col md:flex-row overflow-hidden
                                         bg-gradient-to-r to-gray-300 from-gray-500 rounded-lg shadow-xl mt-4 w-100 mx-2">

                  <div className="h-64 w-auto md:w-1/2">
                    <img className="inset-0 h-full w-full object-cover object-center" src={
                      image !== null
                        ? `data:image/jpg;base64, ${image}`
                        : '/sample-9.jpg'

                    } alt={name} />
                  </div>

                  <div className="w-full py-4 px-6 text-gray-800 flex flex-col text-center items-center">
                    <h3 className="font-semibold text-2xl uppercase  p-5 leading-tight truncate self-center">{name}</h3>
                    <p className="text-md text-gray-700 tracking-wide font-semibold mt-2">
                      {
                        description !== null
                          ? description
                          : `Entra per scoprire ${name}`
                      }
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
        <div className="p-2">
          <div id="card">
            <div className="container w-100 lg:w-4/5 mx-auto flex flex-col">

              <div v-for="card in cards" className="flex flex-col md:flex-row overflow-hidden
                                         bg-gray-300 rounded-lg shadow-xl w-100">
                <div className="h-24 w-24 md:w-24">
                  <img className="inset-0 h-full w-full object-cover object-center" src={image !== null
                    ? `data:image/jpg;base64, ${image}`
                    : '/sample-9.jpg'} alt={name} />         </div>

                <div className="w-full py-4 px-6 text-gray-800 flex flex-col my-auto">
                  <h3 className="font-semibold text-lg leading-tight truncate cursor-default">{name}</h3>
                  <p className="mt-2">
                    {description}
                  </p>
                </div>
                <div className='h-auto w-1/2 bg-gray-400 flex flex-col items-center' >
                  <div className='h-full w-full hover:bg-gray-500 flex flex-col cursor-pointer' onClick={onClickMenu}>
                    <div className='mx-auto my-auto'>MENU</div>
                  </div>
                  <div className='h-full w-full hover:bg-gray-500 flex flex-col cursor-pointer' onClick={onClick}>
                    <div className='mx-auto my-auto'>PRENOTAZIONI</div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      )
    default: <></>
  }

}

export default MerchantCard