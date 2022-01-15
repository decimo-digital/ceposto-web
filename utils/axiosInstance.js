import axios from 'axios'

const axiosAuth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/auth`
})

const axiosMerchant = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/merchant`
})

const axiosUsers = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/users`
})


const axiosPrenotation = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/prenotation`
})

const axiosMenu = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/menu`
})

const axiosRes = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER
})

export {
  axiosRes as default,
  axiosAuth,
  axiosMerchant,
  axiosPrenotation,
  axiosUsers,
  axiosMenu
}
