import axios from 'axios'

const axiosAuth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/auth`
})

const axiosMerchant = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/merchant`
})

const axiosPrenotation = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/prenotation`
})

const axiosRes = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER
})

export {
  axiosRes as default,
  axiosAuth,
  axiosMerchant,
  axiosPrenotation
}
