const Papaparse = require('papaparse')

import currencyFormatter from 'utils/currencyFormatter'

const { daysOfWeek, userRoles, assetsCodeOptions } = require('./enums')
const { default: isObjectEmpty } = require('./isObjectEmpty')

function getUsersListFile(users, type, months = [], assetType = '') {
  let transformedUsers = {}
  switch (type) {
    case assetsCodeOptions[0].value:
      transformedUsers = users
        .filter(
          (user) =>
            user.role_id === userRoles.DEPENDENT &&
            user.balance.hasOwnProperty(assetsCodeOptions[0].value)
        )
        .map((user) => {
          return [
            user.identity_code,
            user.first_name,
            user.last_name,
            user.username,
            // user.bpvalue.ticket_value,
            // user.balance[assetsCodeOptions[0].value].amount,
            0,
            assetsCodeOptions[0].name
          ]
        })
      break
    case assetsCodeOptions[1].value:
      transformedUsers = users
        .filter(
          (user) =>
            user.role_id === userRoles.DEPENDENT &&
            user.balance.hasOwnProperty(assetsCodeOptions[1].value)
        )
        .map((user) => {
          return [
            user.identity_code,
            user.first_name,
            user.last_name,
            user.username,
            // user.balance[assetsCodeOptions[1].value].amount / 100,
            0,
            assetsCodeOptions[1].name
          ]
        })
      break
    case assetsCodeOptions[2].value:
      transformedUsers = users
        .filter(
          (user) =>
            user.role_id === userRoles.DEPENDENT &&
            user.balance.hasOwnProperty(assetsCodeOptions[2].value)
        )
        .map((user) => {
          return [
            user.identity_code,
            user.first_name,
            user.last_name,
            user.username,
            // user.balance[assetsCodeOptions[2].value].amount / 100,
            0,
            assetsCodeOptions[2].name
          ]
        })
      break
    case 'registry':
      transformedUsers = users
        .filter((user) => user.role_id === userRoles.DEPENDENT)
        .map((user) => {
          const userPresence = user.presences
          let userPresenceString = ''
          if (!isObjectEmpty(userPresence)) {
            userPresence.MON
              ? (userPresenceString = userPresenceString.concat('LUN'))
              : ''
            userPresence.TUE
              ? (userPresenceString = userPresenceString.concat(',', 'MAR'))
              : ''
            userPresence.WED
              ? (userPresenceString = userPresenceString.concat(',', 'MER'))
              : ''
            userPresence.THU
              ? (userPresenceString = userPresenceString.concat(',', 'GIO'))
              : ''
            userPresence.FRI
              ? (userPresenceString = userPresenceString.concat(',', 'VEN'))
              : ''
            userPresence.SAT
              ? (userPresenceString = userPresenceString.concat(',', 'SAB'))
              : ''
            userPresence.SUN
              ? (userPresenceString = userPresenceString.concat(',', 'DOM'))
              : ''
          }

          return [
            user.identity_code,
            user.first_name,
            user.last_name,
            user.username,
            user.phone.slice(3, user.phone.length),
            user.status_id ? 'N' : 'S',
            user.balance.hasOwnProperty(assetsCodeOptions[0].value) ? 'S' : 'N',
            userPresenceString,
            user.bpvalue.ticket_value,
            user.balance.hasOwnProperty(assetsCodeOptions[1].value) ? 'S' : 'N',
            !isObjectEmpty(user.hasPiva) ? 'S' : 'N',
            user.balance.hasOwnProperty(assetsCodeOptions[2].value) ? 'S' : 'N'
          ]
        })
      break
    case 'tickets':
      transformedUsers = users.map((user) => {
        return {
          matricola: user.user_matr_number,
          nome: user.user_name_first,
          cognome: user.user_name_surname,
          mail: user.user_username,
          'quantità buoni': 0
        }
      })
      break
    case 'report-beneficiari':
      let formattedData = []
      transformedUsers = users.map((user) => {
        const userOperations = []
        for (let i = 0; i < months.length; i++) {
          const thisDateTransactions = user.transactions.filter(
            (transaction) => transaction.date === months[i]
          )

          if (thisDateTransactions.length > 0) {
            let operations = []
            let bpValue = 0

            thisDateTransactions.forEach((operation) => {
              operation.operations.forEach((op) => {
                if (op.asset === assetType) {
                  operations.push(op)

                  if (
                    op.asset === process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET
                  )
                    bpValue = op.value
                }
              })
            })

            const totalCount = operations
              .map((op) =>
                Number(
                  op.asset === process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET
                    ? op.count
                    : op.total_value
                )
              )
              .reduce((prev, curr) => prev + curr, 0)

            const string =
              totalCount === 0
                ? '-'
                : `${totalCount} ${
                    assetType ===
                    process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET
                      ? `buon${
                          totalCount > 1 ? 'i' : 'o'
                        } da ${currencyFormatter(bpValue)}`
                      : ''
                  }€`

            userOperations.push(string)
          } else {
            userOperations.push('-')
          }
        }
        formattedData = [user.first_name, user.last_name]
        userOperations.forEach((uo) => formattedData.push(uo))

        return formattedData
      })
      break
    default:
      transformedUsers = {}
      break
  }

  return transformedUsers
}
module.exports = getUsersListFile
