import isObjectEmpty from './isObjectEmpty'

const axios = require('utils/axiosInstance').default

const vatNumberRegex = /^(IT)?[0-9]{11}$/
const fiscalCodeRegex =
  /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/
const otpRegex = /^\d{6}$/

const isValidOtpCode = (otp) =>
  typeof otp !== 'undefined' && otp.trim() !== '' && otpRegex.test(otp)

const isValidEmail = (email) =>
  typeof email !== 'undefined' &&
  email.trim() !== '' &&
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )

const isValidNameOrSurname = (nameOrSurname) =>
  nameOrSurname?.trim() !== '' && /^[\D\s]+$/.test(nameOrSurname)

const isValidPassword = (password) =>
  typeof password !== 'undefined' &&
  password.trim() !== '' &&
  /^(?=.+[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&.\\\-<>{}\^]{8,}$/.test(password)

const isValidPhoneNumber = (phone) =>
  typeof phone !== 'undefined' && phone.trim() !== '' && /^\d+$/.test(phone)

const isValidVatNumber = (value) =>
  value.trim() !== '' &&
  (vatNumberRegex.test(value) || value.trim() === '00000000000')

const isValidFiscalCode = (value) =>
  value.trim() !== '' &&
  (fiscalCodeRegex.test(value) ||
    vatNumberRegex.test(value) ||
    value.trim() === '00000000000' ||
    value.trim() === '0000000000000000')

const isValidIBAN = (input) => {
  const CODE_LENGTHS = {
    AD: 24,
    AE: 23,
    AT: 20,
    AZ: 28,
    BA: 20,
    BE: 16,
    BG: 22,
    BH: 22,
    BR: 29,
    CH: 21,
    CR: 21,
    CY: 28,
    CZ: 24,
    DE: 22,
    DK: 18,
    DO: 28,
    EE: 20,
    ES: 24,
    FI: 18,
    FO: 18,
    FR: 27,
    GB: 22,
    GI: 23,
    GL: 18,
    GR: 27,
    GT: 28,
    HR: 21,
    HU: 28,
    IE: 22,
    IL: 23,
    IS: 26,
    IT: 27,
    JO: 30,
    KW: 30,
    KZ: 20,
    LB: 28,
    LI: 21,
    LT: 20,
    LU: 20,
    LV: 21,
    MC: 27,
    MD: 24,
    ME: 22,
    MK: 19,
    MR: 27,
    MT: 31,
    MU: 30,
    NL: 18,
    NO: 15,
    PK: 24,
    PL: 28,
    PS: 29,
    PT: 25,
    QA: 29,
    RO: 24,
    RS: 22,
    SA: 24,
    SE: 24,
    SI: 19,
    SK: 24,
    SM: 27,
    TN: 24,
    TR: 26
  }
  const iban = String(input)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '') // keep only alphanumeric characters
  const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/) // match and capture (1) the country code, (2) the check digits, and (3) the rest

  let digits
  // check syntax and length
  if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
    return false
  }
  // rearrange country code and check digits, and convert chars to ints
  digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) {
    return letter.charCodeAt(0) - 55
  })
  // final check
  return mod97(digits)
}
const mod97 = (string) => {
  let checksum = string.slice(0, 2),
    fragment

  for (let offset = 2; offset < string.length; offset += 7) {
    fragment = String(checksum) + string.substring(offset, offset + 7)
    checksum = parseInt(fragment, 10) % 97
  }

  return checksum
}

const isValidRedeemableTicketsAmount = (
  value,
  maxNumTickets = Number.MAX_SAFE_INTEGER,
  hasToBeStrictlyInteger = true
) =>
  typeof value !== 'undefined' &&
  value !== '' &&
  !Number.isNaN(value) &&
  Number(value) >= 0 &&
  (hasToBeStrictlyInteger ? Number(value) % 1 === 0 : true) &&
  Number(value) <= maxNumTickets

const isDuplicateEmail = async (email, token) => {
  let { data: isDuplicate } = await axios({
    method: 'POST',
    url: '/users',
    data: { username: email },
    headers: { 'x-access-token': token },
    validateStatus: (status) => status < 500, // Reject only if the status code is greater than or equal to 500
    transformResponse: (data) => {
      let parsedData = JSON.parse(data)

      return (
        parsedData.errors &&
        parsedData.errors.filter(
          (error) =>
            error.param === 'username' &&
            error.msg === 'Username already present in DB'
        ).length === 1
      )
    }
  })
  return isDuplicate
}

const checkModifiedField = (initialData, row, field) => {
  let valToChk = {}
  initialData.map((employee) => {
    if (employee.user_id === row.row.original.user_id) {
      valToChk = employee
    }
  })

  if (field === 'redeemable_tickets')
    return parseFloat(row.row.values[field]) !== valToChk[field]
  else return row.row.values[field] !== valToChk[field]
}

const isValidPresences = (presences) => {
  console.log('presenze', presences)
  if (presences === null || isObjectEmpty(presences))
    return true
  else {
    const test = presences.split(',')
    const days = ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM']
    return test.every(day => days.includes(day))
  }



}

export {
  isValidOtpCode,
  isValidNameOrSurname,
  isValidEmail,
  isDuplicateEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidVatNumber,
  isValidFiscalCode,
  isValidIBAN,
  isValidRedeemableTicketsAmount,
  checkModifiedField,
  isValidPresences
}
