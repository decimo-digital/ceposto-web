
import MerchantCard from 'components/MerchantCard'
import Head from 'next/head'

const ForgottenPassword = () => {

  const restaurants = [
    {
      id: 1,
      name: 'Da Lillo',
      description: 'Porcaccia la madonna, avqua a 8€',
      image: 'r1.jpg'
    },
    {
      id: 2,
      name: 'Pescaria',
      description: 'Mannaggia se è buono il pesce qua',
      image: 'r2.jpg',
    },
    {
      id: 3,
      name: 'Cannavacciuolo Bistrot',
      description: 'Hai cagato?',
      image: 'r4.jpg'
    },
    {
      id: 4,
      name: 'La Cadrega',
      description: 'Mangiare qui è un inganno',
      image: 'cadrega.jpg'
    }
  ]

  return (
    <>
      <Head>
        <title>CePosto</title>
      </Head>
      <div class="w-full">

        <div class="md:flex md:space-x-10 items-center bg-black p-24">
          <div class="w-full h-full text-center ">

            <p className='bold text-5xl text-white'> CePosto </p>

          </div>
        </div>



        <div className='p-10'>
          {
            restaurants.map(
              restaurant => {
                const {
                  name,
                  description,
                  image
                } = restaurant
                return (
                  <MerchantCard
                    name={name}
                    description={description}
                    image={image} />
                )
              }
            )
          }
        </div>




      </div>




    </>
  )
}

export default ForgottenPassword
