import axios from 'axios'

const axiosAuth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/auth`
})

const axiosMerchant = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/merchants`
})

const axiosBanking = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/banking`
})

const axiosUsers = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/users`
})

const axiosUnits = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/units`
})

const axiosRes = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER
})

export {
  axiosRes as default,
  axiosAuth,
  axiosMerchant,
  axiosBanking,
  axiosUsers,
  axiosUnits
}
