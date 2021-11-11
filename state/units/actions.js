import axiosRes, {
  axiosUsers,
  axiosMerchant,
  axiosUnits
} from 'utils/axiosInstance'
import axiosInstance from 'utils/axiosInstance'
import { unitScopes, statUses, userRoles, assetsCodeOptions } from 'utils/enums'
import isObjectEmpty from 'utils/isObjectEmpty'
import dayjs from 'dayjs'
import { formatWeekdayShort } from 'utils/localeUtils'
import { readBinaryPhoto } from 'utils/fileReader'
import decamelizeObject from 'utils/decamelizeObject'

/* Action types */

// Units
const GET_UNITS = 'GET_UNITS'
const UPDATE_UNIT = 'UPDATE_UNIT'
const DELETE_UNIT = 'DELETE_UNIT'
const ADD_UNIT = 'ADD_UNIT'
const GET_UNIT_BALANCES = 'GET_UNIT_BALANCES'

// Contracts
const GET_UNIT_CONTRACT = 'GET_UNIT_CONTRACT'
const GET_UNITS_CONTRACTS = 'GET_UNITS_CONTRACTS'
const UPDATE_CONTRACT = 'UPDATE_CONTRACT'

// Purchases
const GET_UNIT_PURCHASES = 'GET_UNIT_PURCHASES'
const GET_UNITS_PURCHASES = 'GET_UNITS_PURCHASES'
const UPDATE_PURCHASES = 'UPDATE_PURCHASES'

// Balances
const GET_UNITS_BPVALUES = 'GET_UNITS_BPVALUES'
const CLEAR_UNITS_BALANCES = 'CLEAR_UNITS_BALANCES'
const UPDATE_BALANCES = 'UPDATE_BALANCES'

// Cashouts
const GET_UNIT_CASHOUTS = 'GET_UNIT_CASHOUTS'
const UPDATE_CASHOUTS = 'UPDATE_CASHOUTS'

// Invoices
const GET_UNIT_INVOICES = 'GET_UNIT_INVOICES'
const UPDATE_INVOICES = 'UPDATE_INVOICES'

// Employees
const GET_UNITS_EMPLOYEES = 'GET_UNITS_EMPLOYEES'
const GET_UNITS_EMPLOYEES_ACCREDITS_HISTORY =
  'GET_UNITS_EMPLOYEES_ACCREDITS_HISTORY'
const GET_EMPLOYEES = 'GET_EMPLOYEES'
const GET_UNIT_ADMIN = 'GET_UNIT_ADMIN'
const UPDATE_EMPLOYEES = 'UPDATE_EMPLOYEES'
const ADD_EMPLOYEE = 'ADD_EMPLOYEE'
const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE'
const UPDATE_UNITS_EMPLOYEES = 'UPDATE_UNITS_EMPLOYEES'
const UPDATE_EMPLOYEE_BATCH = 'UPDATE_EMPLOYEE_BATCH'
const REMOVE_EMPLOYEE = 'REMOVE_EMPLOYEE'
const GET_UNIT_EMPLOYEES_BPVALUES = 'GET_UNIT_EMPLOYEES_BPVALUES'
const UPDATE_UNIT_EMPLOYEES_TICKETS = 'UPDATE_UNIT_EMPLOYEES_TICKETS'
const UPDATE_EMPLOYEE_REEDEMABLE_TICKETS = 'UPDATE_EMPLOYEE_REEDEMABLE_TICKETS'
const UPDATE_EMPLOYEES_ASSIGNALL_REEDEMABLE_TICKETS =
  'UPDATE_EMPLOYEES_ASSIGNALL_REEDEMABLE_TICKETS'
const UPDATE_UNIT_EMPLOYEE_REEDEMABLE_TICKETS =
  'UPDATE_UNIT_EMPLOYEE_REEDEMABLE_TICKETS'
const ADD_USER = 'ADD_USER'
const UPDATE_USER = 'UPDATE_USER'
const UPDATE_UNIT_EMPLOYEE_STATUS = 'UPDATE_UNIT_EMPLOYEE_STATUS'
const REMOVE_EMPLOYEE_FROM_UNIT = 'REMOVE_EMPLOYEE_FROM_UNIT'
// Admin
const ADD_ADMIN = 'ADD_ADMIN'
const UPDATE_ADMIN = 'UPDATE_ADMIN'
const UPDATE_SUBUNIT_ADMIN = 'UPDATE_SUBUNIT_ADMIN'
const UPDATE_UNITS_ADMINS = 'UPDATE_UNITS_ADMINS'
const REMOVE_ADMIN = 'REMOVE_ADMIN'

// Employees presences
const GET_EMPLOYEES_PRESENCES = 'GET_EMPLOYEES_PRESENCES'
const UPDATE_EMPLOYEE_PRESENCES = 'UPDATE_EMPLOYEE_PRESENCES'

// Units of unit
const GET_CURRENT_UNIT_UNITS = 'GET_CURRENT_UNIT_UNITS'
const ADD_CURRENT_UNIT_UNITS = 'ADD_CURRENT_UNIT_UNITS'
const DELETE_CURRENT_UNIT_SUBUNIT = 'DELETE_CURRENT_UNIT_SUBUNIT'
const UPDATE_CURRENT_UNIT_SUBUNIT = 'UPDATE_CURRENT_UNIT_SUBUNIT'

/* Actions */

// Units
const getOwnerUnits = () => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { currentUnitIndex } = getState()

    let { data: units } = await axiosRes.get('users/me/units', {
      headers: { 'x-access-token': token }
    })
    units.data = units.data.filter(
      (unit) =>
        unit.scope_id !== unitScopes.PIVA &&
        unit.scope_id !== unitScopes.MERCHANT &&
        unit.role_id !== userRoles.DEPENDENT
    )

    units.data = await Promise.all(
      units.data.map(async (unit) => {
        try {
          if (unit.scope_id !== unitScopes.MERCHANT) {
            const { data: contractsData } = await axiosUnits.get(
              `/${unit.id}/contracts`,
              { headers: { 'x-access-token': token } }
            )

            let discounts = {
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET]: 0
            },
              service_costs = {
                [process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET]: 0
              }

            discounts = contractsData.data[0].convention.discount
            service_costs = contractsData.data[0].convention.service_cost

            if (unit.scope_id === unitScopes.COMPANY) {
              const { data: bpvalues } = await axiosRes.get(
                `/units/${unit.id}/bpvalues`,
                { headers: { 'x-access-token': token } }
              )

              return {
                ...unit,
                bpvalues: bpvalues.data,
                contract: { discounts, service_costs }
              }
            }

            return {
              ...unit,
              contract: { discounts: discounts, service_costs: service_costs }
            }
          }
        } catch { }
        return unit
      })
    )

    dispatch({
      type: GET_UNITS,
      payload: { units, currentUnitIndex }
    })
  }
}

const updateUnit = ({
  updatedUnit,
  useCustomInvoiceNumber = false,
  _currentUnitIndex = -1
}) => {
  console.log('updatedUnit', updatedUnit)
  return async (dispatch, getState) => {
    const { units, currentUnitIndex } = getState()
    const { token } = getState().auth

    const unitIndex =
      _currentUnitIndex !== -1 ? _currentUnitIndex : currentUnitIndex

    const unitId = updatedUnit.id ?? units.data[unitIndex].id

    let bpvalues = []
    console.log('cjnhqcwnncqcwoicwnqiw', updatedUnit.scope_id)
    if (updatedUnit.scope_id === unitScopes.COMPANY) {
      const { data: unitBpValues } = await axiosRes.get(
        `/units/${unitId}/bpvalues`,
        { headers: { 'x-access-token': token } }
      )

      console.log('unitBpValues', unitBpValues)
      bpvalues = unitBpValues.data
    }

    dispatch({
      type: UPDATE_UNIT,
      payload: {
        unit: {
          ...updatedUnit,
          bpvalues
        },
        currentUnitIndex: unitIndex
      }
    })
  }
}

const deleteUnit = (unitId) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth

    if (unitId > 0)
      await axiosRes.delete(`/units/${unitId}`, {
        headers: { 'x-access-token': token }
      })

    dispatch({
      type: DELETE_UNIT,
      payload: { unitId }
    })
  }
}

const addUnit = (unitInfo = { scope_id }) => {
  return async (dispatch, getState) => {
    const newUnit = unitInfo

    let userRole = newUnit?.role_id ?? userRoles.GENERATOR_DISTRIBUTOR
    if (unitInfo.scope_id === unitScopes.PIVA) userRole = userRoles.PIVA
    else if (unitInfo.scope_id === unitScopes.MERCHANT_ADMIN)
      userRole = userRoles.MERCHANT_ADMIN

    dispatch({
      type: ADD_UNIT,
      payload: {
        unit: {
          id: newUnit?.id ?? -1,
          address: newUnit?.address,
          business_name: newUnit?.business_name,
          cap: newUnit?.cap,
          city: newUnit?.city,
          created_by: newUnit?.created_by,
          email: newUnit?.email,
          fiscal_code: newUnit?.fiscal_code,
          fiscal_regime: newUnit?.fiscal_regime,
          geo_x: newUnit?.geo_x,
          geo_y: newUnit?.geo_y,
          has_custom_invoicing: newUnit?.has_custom_invoicing,
          iban: newUnit?.iban,
          image_id: newUnit?.image_id,
          is_pa: newUnit?.is_pa,
          legal_nature: newUnit?.legal_nature,
          phone: newUnit?.phone,
          preferred_payment_mode_id: newUnit?.preferred_payment_mode_id,
          province: newUnit?.province,
          recipient_code: newUnit?.recipient_code,
          role_id: userRole,
          scope_id: newUnit?.scope_id,
          status_id: newUnit?.status_id,
          store_name: newUnit?.store_name,
          subcategory_id: newUnit?.subcategory_id,
          unit_owner_id: newUnit?.unit_owner_id,
          vat_number: newUnit?.vat_number,
          employees: { total_count: 0, visited_pages: [], employees: [] },
          contract: {
            discounts: {
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_TICKET]: 0,
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_BR_TICKET]: 0,
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_FB_TICKET]: 0,
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_FX_TICKET]: 0,
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_PP_TICKET]: 0,
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_SR_TICKET]: 0
            },
            service_costs: {
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_TICKET]: 0,
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_BR_TICKET]: 0,
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_FB_TICKET]: 0,
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_FX_TICKET]: 0,
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_PP_TICKET]: 0,
              [process.env.NEXT_PUBLIC_STELLAR_TICKET_SR_TICKET]: 0
            }
          },
          invoices: [],
          purchases: [],
          bpvalues: []
        }
      }
    })
  }
}

// Contracts
const getUnitContract = (_unitIndex = -1) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { currentUnitIndex, units } = getState()

    const unitIndex = _unitIndex === -1 ? currentUnitIndex : _unitIndex

    const { data: contracts } = await axiosRes.get(
      `/units/${units.data[unitIndex].id}/contracts`,
      { headers: { 'x-access-token': token } }
    )

    const contract = contracts[0] !== null ? contracts[0] : undefined

    dispatch({
      type: GET_UNIT_CONTRACT,
      payload: {
        contract,
        currentUnitIndex: unitIndex
      }
    })
  }
}

const getUnitsContracts = () => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units } = getState()

    const unitsWithContracts = await Promise.all(
      units.data.map(async (unit) => {
        if (unit.id === 0) return unit

        const { data: contracts } = await axiosRes.get(
          `/units/${unit.id}/contracts`,
          {
            headers: { 'x-access-token': token }
          }
        )

        return { ...unit, contracts: contracts.data }
      })
    )

    dispatch({
      type: GET_UNITS_CONTRACTS,
      payload: {
        units: unitsWithContracts
      }
    })
  }
}

const updateContract = (updatedContract, _currentUnitIndex = -1) => {
  return async (dispatch, getState) => {
    const { currentUnitIndex, units } = getState()
    const { token } = getState().auth

    const unitIndex =
      _currentUnitIndex === -1 ? currentUnitIndex : _currentUnitIndex

    const unit = units.data[unitIndex]

    await axiosRes.patch(
      `/units/${unit.unit_id}/contracts/${unit.contract.id}`,
      updatedContract,
      {
        headers: { 'x-access-token': token }
      }
    )

    const { data: contracts } = await axiosRes.get(
      `/units/${unit.unit_id}/contracts`,
      {
        headers: { 'x-access-token': token }
      }
    )

    dispatch({
      type: UPDATE_CONTRACT,
      payload: {
        contract: contracts[0],
        currentUnitIndex: unitIndex
      }
    })
  }
}

const getUnitAdmin = (unitId) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { currentUnitIndex } = getState()

    let { data: admin } = await axiosRes.get(`/units/${unitId}/admin`, {
      headers: { 'x-access-token': token }
    })

    if (
      typeof admin.user_id !== 'undefined' &&
      (admin.unit_scope_id === unitScopes.MERCHANT_ADMIN ||
        admin.unit_scope_id === unitScopes.GDO_ADMIN)
    ) {
      let { data: unitAdminEmailForPassrec } = await axiosRes.get(
        `/users/${admin.user_id}/password_recovery_email`,
        {
          headers: { 'x-access-token': token }
        }
      )

      admin = {
        ...admin,
        ...unitAdminEmailForPassrec
      }
    }

    dispatch({
      type: GET_UNIT_ADMIN,
      payload: { admin, currentUnitIndex }
    })
  }
}

const getUnitEmployees = ({ page = 1 }) => {
  return async (dispatch, getState) => {
    console.log('getUnitEmployees')
    const { token } = getState().auth
    const { currentUnitIndex, units } = getState()

    const unitId = units.data[currentUnitIndex].id
    console.log('unitId: ', unitId)

    if (units.data[currentUnitIndex].employees?.visited_pages?.includes(page) ?? false)
      return units.data[currentUnitIndex]

    const { data: employees } = await axiosRes.get(
      `/units/${unitId}/users?page=${page}`,
      {
        headers: { 'x-access-token': token }
      }
    )
    console.log(employees)
    let notDependent = 0
    let employeesWithBalances = employees.data
    if (employeesWithBalances.length > 0) {
      employeesWithBalances = await Promise.all(
        employees.data.map(async (employee) => {
          if (employee.role_id !== userRoles.DEPENDENT) notDependent++
          const { data: balance } = await axiosUsers.get(
            `${employee.id}/balances`,
            { headers: { 'x-access-token': token } }
          )
          console.log(`${employee.id}/balances   --> `, employee.username)
          console.log('EMP BALNCE di ', employee.username, ' ', balance)
          //console.log('EMPLOYEE WEEKLY PRESENCES: ', employee.id)
          const { data: employeePresences } = await axiosRes.get(
            `/units/${unitId}/users/${employee.id}/weeklypresences`,
            {
              headers: { 'x-access-token': token }
            }
          )
          //console.log('presenze di :', employee.id, employeePresences)
          let userBalancesInfo = balance.data
          const redeemed_tickets = {}
          for (const asset in userBalancesInfo) {
            if (asset === assetsCodeOptions[0].value)
              redeemed_tickets[asset] = userBalancesInfo[asset].amount
            else redeemed_tickets[asset] = userBalancesInfo[asset].amount / 100
          }
          //console.log('NON STAMPA', redeemed_tickets)

          const { data: bpvalue } = await axiosUsers.get(
            `/${employee.id}/bpValue`,
            {
              headers: { 'x-access-token': token }
            }
          )
          console.log('BP DI: ', employee.id, ': ', bpvalue)

          return {
            ...employee,
            bpvalue,
            balance: userBalancesInfo,
            presences: employeePresences.weeklyPresences,
            redeemable_tickets: 0,
            redeemed_tickets
          }
        })
      )

      dispatch({
        type: GET_EMPLOYEES,
        payload: {
          total_count: employees.meta.total_count - notDependent,
          visited_page: page,
          employees: employeesWithBalances,
          currentUnitIndex
        }
      })
    } else
      dispatch({
        type: GET_EMPLOYEES,
        payload: {
          total_count: employees.meta.total_count - notDependent,
          employees: employeesWithBalances,
          currentUnitIndex
        }
      })
  }
}

const getUnitsEmployees = ({ page = 1, range = '' }) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units } = getState()
    console.log('-_>UNIT', units.data)
    var allUnits = units.data

    const employees = await Promise.all(
      allUnits.map(async (unit) => {
        console.log(unit.id)
        let notDependent = 0
        const { data: employees } = await axiosInstance.get(
          `units/${unit.id}/users`,
          {
            headers: { 'x-access-token': token }
          }
        )

        let employeesWithBalances = employees.data
        if (employeesWithBalances.length > 0) {
          employeesWithBalances = await Promise.all(
            employees.data.map(async (employee) => {
              console.log(
                'EMPLOYEE BALANCES, ',
                employee.id,
                employee.username,
                ' della unit ',
                unit.id
              )
              if (employee.role_id !== userRoles.DEPENDENT) notDependent++
              const { data: balance } = await axiosUsers.get(
                `${employee.id}/balances`,
                {
                  headers: { 'x-access-token': token }
                }
              )
              console.log('EMPLOYEE WEEKLY PRESENCES: ', employee.id)
              const { data: employeePresences } = await axiosRes.get(
                `/units/${unit.id}/users/${employee.id}/weeklypresences`,
                {
                  headers: { 'x-access-token': token }
                }
              )
              console.log('presenze di :', employee.id, employeePresences)
              let userBalancesInfo = balance.data
              const redeemed_tickets = {}
              for (const asset in userBalancesInfo) {
                redeemed_tickets[asset] = userBalancesInfo[asset].amount
              }
              console.log('NON STAMPA', redeemed_tickets)

              return {
                ...employee,
                balance: userBalancesInfo,
                presences: employeePresences.weeklyPresences,
                redeemable_tickets: 0,
                redeemed_tickets
              }
            })
          )
        }
        return {
          total_count: employees.meta.total_count - notDependent,
          employees: employeesWithBalances
        }
      })
    )

    dispatch({
      type: GET_UNITS_EMPLOYEES,
      payload: { visited_page: page, employees }
    })
  }
}

const getUnitsEmployeesAccreditsHistoryInRange = ({
  range,
  onlyAccredit = false
}) => {
  return async (dispatch, getState) => {
    console.log('GETACCREDIT')
    const { token } = getState().auth
    const { units } = getState()

    let isRangeAlreadySearched = false

    // for (let unit of units) {
    //   for (let employee of unit.employees.employees) {
    //     if (
    //       employee.accreditsHistory &&
    //       Object.keys(employee.accreditsHistory).includes(range)
    //     ) {
    //       isRangeAlreadySearched = true
    //       break
    //     }
    //   }

    //   if (isRangeAlreadySearched) break
    // }

    if (isRangeAlreadySearched)
      dispatch({
        type: GET_UNITS_EMPLOYEES_ACCREDITS_HISTORY,
        payload: { units }
      })
    else {
      const unitsWithEmployeesInfo = await Promise.all(
        units.map(async (unit) => {
          const employeesWithAccreditsInfo = await Promise.all(
            unit.employees.employees.map(async (employee) => {
              if (onlyAccredit) {
                const { data: ticketsHistory } = await axiosRes.get(
                  `/users/${employee.user_id}/transactionsHistory?range=${range}&filter=accredits`,
                  { headers: { 'x-access-token': token } }
                )

                let ticketsOfDay = 0

                if (ticketsHistory.transactions.length > 0) {
                  for (let { tickets } of ticketsHistory.transactions) {
                    ticketsOfDay += tickets
                  }
                }

                return {
                  ...employee,
                  accreditsHistory: {
                    ...employee.accreditsHistory,
                    [range]: { tickets: ticketsOfDay }
                  }
                }
              } else {
                const [{ data: ticketsHistory }, { data: presencesHistory }] =
                  await Promise.all([
                    axiosRes.get(
                      `/users/${employee.user_id}/transactionsHistory?range=${range}&filter=accredits`,
                      { headers: { 'x-access-token': token } }
                    ),
                    axiosRes.get(
                      `/users/${employee.user_id}/presences?range=${range}`,
                      { headers: { 'x-access-token': token } }
                    )
                  ])

                let ticketsAndPresencesOfWeek = {
                  LUN: { tickets: 0, presence: null },
                  MAR: { tickets: 0, presence: null },
                  MER: { tickets: 0, presence: null },
                  GIO: { tickets: 0, presence: null },
                  VEN: { tickets: 0, presence: null },
                  SAB: { tickets: 0, presence: null },
                  DOM: { tickets: 0, presence: null }
                }

                if (ticketsHistory.transactions.length > 0) {
                  for (let { date, tickets } of ticketsHistory.transactions) {
                    ticketsAndPresencesOfWeek[
                      formatWeekdayShort(dayjs(date).day(), 'it')
                    ].tickets =
                      ticketsAndPresencesOfWeek[
                        formatWeekdayShort(dayjs(date).day(), 'it')
                      ].tickets + tickets
                  }
                }

                if (presencesHistory.length > 0) {
                  for (let {
                    reportDatetime,
                    presenceState
                  } of presencesHistory) {
                    ticketsAndPresencesOfWeek[
                      formatWeekdayShort(dayjs(reportDatetime).day(), 'it')
                    ].presence = presenceState
                  }
                }

                return {
                  ...employee,
                  accreditsHistory: {
                    ...employee.accreditsHistory,
                    [range]: ticketsAndPresencesOfWeek
                  }
                }
              }
            })
          )

          return {
            ...unit,
            employees: {
              ...unit.employees,
              employees: employeesWithAccreditsInfo
            }
          }
        })
      )

      dispatch({
        type: GET_UNITS_EMPLOYEES_ACCREDITS_HISTORY,
        payload: { units: unitsWithEmployeesInfo }
      })
    }
  }
}

const updateUnitEmployesTickets = (_currentUnitIndex = -1) => {
  return async (dispatch, getState) => {
    const { units, user, currentUnitIndex } = getState()
    const { token } = getState().auth

    const unitIndex =
      _currentUnitIndex === -1 ? currentUnitIndex : _currentUnitIndex
  }
}

const updateUnitEmployees = (_currentUnitIndex = -1) => {
  return async (dispatch, getState) => {
    const { units, user, currentUnitIndex } = getState()
    const { token } = getState().auth

    const unitIndex =
      _currentUnitIndex === -1 ? currentUnitIndex : _currentUnitIndex
    if (units[unitIndex].employees.length > 0) {
      units[unitIndex].employees.map(async (employee) => {
        const setUserBody = {
          unitId: employee.user_unit_id,
          name: employee.user_name_first,
          surname: employee.user_name_surname,
          username: employee.user_username,
          phone: employee.user_mob,
          fiscalCode: employee.user_cod_fisc,
          enabled: employee.user_enabled,
          scopeId: employee.user_scope_id,
          inPending: employee.user_inpending,
          imagePath: employee.user_imgpath,
          matrNumber: employee.user_matr_number,
          canMakeTotal: employee.user_chk7 || false,
          canCashout: employee.user_chk8 || false,
          isBanned: employee.user_chk9 || false
        }

        let userId = employee.user_id

        if (userId !== 0)
          await axiosRes.patch(`/users/${employee.user_id}`, setUserBody, {
            headers: { 'x-access-token': token }
          })
        else {
          const { data } = await axiosRes.post('/users', setUserBody, {
            headers: { 'x-access-token': token }
          })

          userId = data.id
        }

        if (user.user_scope_id === unitScopes.COMPANY) {
          const setUserTicketPresenceBody = {
            presences: employee.presences
          }

          await axiosRes.patch(
            `/users/${userId}/tickets`,
            setUserTicketPresenceBody,
            { headers: { 'x-access-token': token } }
          )
        }
      })

      dispatch({
        type: UPDATE_EMPLOYEES,
        payload: { currentUnitIndex }
      })
    }
  }
}

const updateUnitsEmployees = (modifiedEmployeesIds = new Set()) => {
  return async (dispatch, getState) => {
    const { units, user } = getState()
    const { token } = getState().auth

    const unitsEmployees = units
      .filter((unit) => unit.employees.employees.length > 0)
      .map((unit) => unit.employees.employees)
      .flat()
      .filter((employee) => modifiedEmployeesIds.has(employee.user_id))

    let newEmployees = []
    for await (let employee of unitsEmployees) {
      try {
        const setUserBody = {
          unitId: employee.user_unit_id,
          name: employee.user_name_first,
          surname: employee.user_name_surname,
          username: employee.user_username,
          phone: employee.user_mob,

          fiscalCode: employee.user_cod_fisc,
          enabled: employee.user_enabled,
          scopeId: employee.user_scope_id,
          inPending: employee.user_inpending,
          imagePath: employee.user_imgpath,
          matrNumber: employee.user_matr_number,
          canMakeTotal: employee.user_chk7 || false,
          canCashout: employee.user_chk8 || false,
          isBanned: employee.user_chk9 || false
        }

        let userId = employee.user_id

        if (userId > 0)
          await axiosRes.patch(`/users/${employee.user_id}`, setUserBody, {
            headers: { 'x-access-token': token }
          })
        else {
          const { data } = await axiosRes.post('/users', setUserBody, {
            headers: { 'x-access-token': token }
          })

          userId = data.id
        }

        let fieldsToUpdate = {}
        if (user.user_scope_id === unitScopes.COMPANY) {
          let amount = employee.redeemable_tickets

          let setUserTicketPresenceBody = {
            presences: employee.presences,
            present: employee.user_enabled
          }

          if (amount && Number(amount) > 0) {
            amount = Number(amount)

            setUserTicketPresenceBody = {
              ...setUserTicketPresenceBody,
              amount
            }
          }

          await axiosRes.patch(
            `/users/${userId}/tickets`,
            setUserTicketPresenceBody,
            { headers: { 'x-access-token': token } }
          )
        } else if (user.user_scope_id === unitScopes.CITY) {
          let amount =
            units[0].contract.ticket_cost == 0.01
              ? Number(employee.redeemable_tickets) * 100
              : Number(employee.redeemable_tickets)

          const setRedeemableUserTicketsBody = { amount }

          await axiosRes.patch(
            `/users/${userId}/tickets`,
            setRedeemableUserTicketsBody,
            { headers: { 'x-access-token': token } }
          )
        }
        let summed = Number(employee.redeemable_tickets) * 100

        fieldsToUpdate = {
          redeemable_tickets: 0,
          redeemed_tickets:
            units[0].contract.ticket_cost == 0.01
              ? summed + Number(employee.redeemed_tickets)
              : Number(employee.redeemable_tickets) +
              Number(employee.redeemed_tickets)
        }

        newEmployees.push({
          oldId: employee.user_id,
          newId: userId,
          fieldsToUpdate
        })
      } catch (err) {
        console.error(err)
      }
    }

    dispatch({
      type: UPDATE_UNITS_EMPLOYEES,
      payload: {
        newEmployees: newEmployees.filter(
          ({ oldId, newId, fieldsToUpdate }) =>
            oldId !== newId || !isObjectEmpty(fieldsToUpdate)
        )
      }
    })
  }
}

const updateUnitsAdmins = () => {
  return async (dispatch, getState) => {
    const { units, user } = getState()
    const { token } = getState().auth

    const unitsAdmins = units
      .filter((unit) => unit.unit_scope_id === unitScopes.PIVA)
      .map((unit) => unit.admin)
      .flat()

    const newAdmins = await Promise.all(
      unitsAdmins.map(async (admin) => {
        try {
          const setUserBody = {
            unitId: admin.user_unit_id,
            name: admin.user_name_first,
            surname: admin.user_name_surname,
            email: admin.user_username,
            phone: admin.user_mob,
            enabled: admin.user_enabled,
            scopeId: admin.user_scope_id,
            inPending: admin.user_inpending,
            imagePath: admin.user_imgpath,
            canMakeTotal: admin.user_chk7 || false,
            canCashout: admin.user_chk8 || false,
            isBanned: admin.user_chk9 || false
          }

          const setNewBody = {
            email: admin.user_username,
            name: admin.user_name_first,
            surname: admin.user_name_surname,
            phone: admin.user_mob
          }
          let userId = admin.user_unit_id
          if (userId > 0)
            await axiosRes.patch(
              `/units/${user.user_unit_id}/companyAdmin/${admin.user_unit_id}`,
              setNewBody,
              { headers: { 'x-access-token': token } }
            )
          else {
            const { data: companyAdminResponse } = await axiosRes.post(
              `/units/${user.user_unit_id}/companyAdmin`,
              setNewBody,
              { headers: { 'x-access-token': token } }
            )

            userId = companyAdminResponse.companyAdminId
          }

          let fieldsToUpdate = {
            email: admin.user_username,
            name: admin.user_name_first,
            surname: admin.user_name_surname,
            phone: admin.user_mob
          }

          return { oldId: admin.user_unit_id, newId: userId, fieldsToUpdate }
        } catch (err) {
          console.error(err)
        }
      })
    )

    dispatch({
      type: UPDATE_UNITS_ADMINS,
      payload: {
        newAdmins: newAdmins.filter(
          ({ oldId, newId, fieldsToUpdate }) =>
            oldId !== newId || !isObjectEmpty(fieldsToUpdate)
        )
      }
    })
  }
}

const addUnitEmployee = (employeeInfo = {}) => {
  return async (dispatch, getState) => {
    const { units, currentUnitIndex, user } = getState()
    const { token } = getState().auth

    const unit = units.data[currentUnitIndex]

    const {
      user_unit_id = -1,
      user_enabled = true,
      user_name_surname = '',
      user_name_first = '',
      user_username = '',
      user_mob = '',
      user_matr_number = '',
      user_cod_fisc = '',
      presences = [1, 1, 1, 1, 1, 0, 0],
      redeemable_tickets = 0,
      redeemed_tickets = 0
    } = employeeInfo

    let userInfo = {
      unitId: user_unit_id === -1 ? unit.unit_id : user_unit_id,
      scopeId:
        unit.unit_scope_id === unitScopes.COMPANY
          ? unitScopes.EMPLOYEE
          : unit.unit_scope_id === unitScopes.CITY
            ? unitScopes.CITIZEN
            : unitScopes.CIRCUITO_SPESA,
      inPending: false,
      user_publickey: unit.unit_scope_id === unitScopes.COMPANY ? '' : '-1',
      user_imgpath: '',
      enabled: user_enabled,
      surname: user_name_surname,
      name: user_name_first,
      username: user_username,
      phone: user_mob,
      presences,
      matrNumber: user_matr_number,
      redeemable_tickets,
      redeemed_tickets
    }

    if (user_cod_fisc.trim() !== '')
      userInfo = { ...userInfo, fiscalCode: user_cod_fisc }

    const { data: createUserResponse } = await axiosRes.post(
      '/users',
      userInfo,
      { headers: { 'x-access-token': token } }
    )

    employeeInfo = { ...employeeInfo, user_id: createUserResponse.id }

    if (user.user_scope_id === unitScopes.COMPANY) {
      const setUserTicketPresenceBody = {
        presences: userInfo.presences
      }

      await axiosRes.patch(
        `/users/${createUserResponse.id}/tickets`,
        setUserTicketPresenceBody,
        { headers: { 'x-access-token': token } }
      )
    }

    dispatch({
      type: ADD_EMPLOYEE,
      payload: { employeeInfo, currentUnitIndex }
    })
  }
}

const addUnitAdmin = (adminInfo = {}) => {
  return async (dispatch, getState) => {
    const { units, currentUnitIndex, user } = getState()
    const { token } = getState().auth

    const unit = units.data[currentUnitIndex]

    const { data: companyAdminResponse } = await axiosRes.post(
      `/units/${user.user_unit_id}/companyAdmin`,
      adminInfo,
      { headers: { 'x-access-token': token } }
    )

    adminInfo.id = companyAdminResponse.companyAdminId

    dispatch({
      type: ADD_ADMIN,
      payload: { adminInfo }
    })
  }
}

const updateUnitEmployee = (employee, updatedField) => {
  return async (dispatch, getState) => {
    const { units, currentUnitIndex } = getState()

    let unitIndex = currentUnitIndex
    if (
      units.data[currentUnitIndex].id !== employee.id &&
      Object.keys(updatedField)[0] !== 'user_unit_id' &&
      employee.user_id > 0
    ) {
      let found = false
      let i = 0

      while (i < units.length && !found) {
        if (units[i].unit_id === employee.user_unit_id) {
          unitIndex = i
          found = true
        }
        i++
      }
    }
    dispatch({
      type: UPDATE_EMPLOYEE,
      payload: {
        employeeId: employee.id,
        updatedField,
        currentUnitIndex: unitIndex
      }
    })
  }
}

const updateEmployeeReedemableTickets = (employee, amount) => {
  return async (dispatch, getState) => {
    const { units, currentUnitIndex } = getState()
    const unitId = units.data[currentUnitIndex].id

    const [found] = units.data[currentUnitIndex].employees.employees.filter(
      (emp) => emp.id === employee.id
    )
    if (typeof found !== 'undefined')
      dispatch({
        type: UPDATE_EMPLOYEE_REEDEMABLE_TICKETS,
        payload: {
          employeeId: found.id,
          amount,
          unitId
        }
      })
  }
}

const updateUnitEmployeesReedemableTickets = (asset_code) => {
  return async (dispatch, getState) => {
    const { units, currentUnitIndex } = getState()
    const { token } = getState().auth
    const unitId = units.data[currentUnitIndex].id
    const unitEmployees = units.data
      .filter((unit) => unit.id == unitId)
      .map((unit) => unit.employees.employees)
      .flat()

    const { data: admin } = await axiosRes.get(`units/${unitId}/admin`, {
      headers: { 'x-access-token': token }
    })
    console.log(admin.admin.id, 'DM')
    const unitsEmployees = unitEmployees.filter(
      (employee) =>
        employee.redeemable_tickets > 0 &&
        employee.role_id === userRoles.DEPENDENT &&
        employee.balance.hasOwnProperty(asset_code)
    )
    let recipients = []
    for await (let employee of unitsEmployees) {
      const transactionDetails = {
        to: employee.username,
        assets: {
          [asset_code]:
            asset_code !== assetsCodeOptions[0].value
              ? Number(employee.redeemable_tickets) * 100
              : employee.redeemable_tickets
        }
      }

      console.log(
        'Assegno a ',
        employee.first_name,
        ' id: ',
        employee.id,
        ' ',
        employee.redeemable_tickets,
        ' buoni del tipo ',
        asset_code,
        ' dall account ',
        admin.admin.id
      )
      recipients.push(transactionDetails)
    }

    if (recipients.length > 0)
      console.log(`/${admin.admin.id}/transactions`, recipients)

    await axiosUsers.post(
      `/${admin.admin.id}/transactions`,
      { recipients },
      { headers: { 'x-access-token': token } }
    )

    recipients.forEach((transaction) => {
      console.log(
        'aggiorno per ',
        transaction.to,
        'totale ',
        transaction.assets[asset_code]
      )
      dispatch({
        type: 'UPDATE_UNIT_EMPLOYEE_REEDEMABLE_TICKETS',
        payload: {
          unitId,
          to: transaction.to,
          redeemedTickets: transaction.assets[asset_code],
          reedemableTickets: 0,
          asset_code
        }
      })
    })
  }
}

const updateAssignAllReedemableTickets = (reedemableTickets, ticketsType) => {
  return async (dispatch, getState) => {
    const { units, currentUnitIndex } = getState()
    dispatch({
      type: 'UPDATE_EMPLOYEES_ASSIGNALL_REEDEMABLE_TICKETS',
      payload: {
        unitId: units.data[currentUnitIndex].id,
        reedemableTickets,
        ticketsType
      }
    })
  }
}

const updateAdmin = (admin, updatedField) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units, currentUnitIndex, user } = getState()

    let unitIndex = currentUnitIndex
    if (
      units.data[currentUnitIndex].unit_id !== admin.user_unit_id &&
      Object.keys(updatedField)[0] !== 'user_unit_id' &&
      admin.user_id > 0
    ) {
      let found = false
      let i = 0

      while (i < units.length && !found) {
        if (units[i].unit_id === admin.user_unit_id) {
          unitIndex = i
          found = true
        }
        i++
      }
    }

    dispatch({
      type: UPDATE_ADMIN,
      payload: {
        adminId: admin.user_id,
        updatedField,
        currentUnitIndex: unitIndex
      }
    })
  }
}

const updateSubUnitAdmin = (updatedField) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { currentUnitIndex, units } = getState()

    const { user_chk7, user_chk8 } = updatedField

    let updatedUser = {}
    if (typeof user_chk7 !== 'undefined')
      updatedUser.canMakeTotal = user_chk7 == 1
    if (typeof user_chk8 !== 'undefined')
      updatedUser.canCashout = user_chk8 == 1

    await axiosRes.patch(
      `/users/${units.data[currentUnitIndex].admin.user_id}`,
      updatedUser,
      { headers: { 'x-access-token': token } }
    )

    dispatch({
      type: UPDATE_SUBUNIT_ADMIN,
      payload: {
        updatedField,
        currentUnitIndex
      }
    })
  }
}

const updateUnitEmployeeBatch = (username, redeemable_tickets) => {
  return async (dispatch, getState) => {
    const { currentUnitIndex, units } = getState()
    const unitId = units.data[currentUnitIndex].id
    console.log(
      'ACTIONS updateemployeebatch ->',
      unitId,
      username,
      redeemable_tickets
    )
    dispatch({
      type: UPDATE_EMPLOYEE_BATCH,
      payload: { unitId, username, redeemable_tickets }
    })
  }
}

const removeUnitEmployee = (employee, deleteFromDb = true) => {
  return async (dispatch, getState) => {
    const { currentUnitIndex, units } = getState()
    const { token } = getState().auth

    let unitIndex = currentUnitIndex

    if (
      units.data[currentUnitIndex].unit_id !== employee.user_unit_id &&
      employee.user_id > 0
    ) {
      let found = false
      let i = 0

      while (i < units.length && !found) {
        if (units[i].unit_id === employee.user_unit_id) {
          unitIndex = i
          found = true
        }

        i++
      }
    }

    if (deleteFromDb && employee.user_id > 0)
      await axiosRes.delete(`/users/${employee.user_id}`, {
        headers: { 'x-access-token': token }
      })

    dispatch({
      type: REMOVE_EMPLOYEE,
      payload: { userId: employee.user_id, currentUnitIndex: unitIndex }
    })
  }
}

const removeUnitAdmin = (admin, deleteFromDb = true) => {
  return async (dispatch, getState) => {
    const { currentUnitIndex, units, user } = getState()
    const { token } = getState().auth

    let unitIndex = currentUnitIndex

    if (
      units.data[currentUnitIndex].unit_id !== admin.user_unit_id &&
      admin.user_unit_id > 0
    ) {
      let found = false
      let i = 0

      while (i < units.length && !found) {
        if (units[i].unit_id === admin.user_unit_id) {
          unitIndex = i
          found = true
        }
        i++
      }
    }
    if (deleteFromDb && admin.user_unit_id > 0)
      await axiosRes.delete(
        `/units/${user.user_unit_id}/companyAdmin/${admin.user_unit_id}`,
        {
          headers: { 'x-access-token': token }
        }
      )

    dispatch({
      type: REMOVE_ADMIN,
      payload: { currentUnitIndex: unitIndex }
    })
  }
}

const updateUnitEmployeePresences = (employee, checkboxIndex) => {
  return async (dispatch, getState) => {
    const { currentUnitIndex, units } = getState()

    let unitIndex = currentUnitIndex

    if (
      units.data[currentUnitIndex].unit_id !== employee.user_unit_id &&
      employee.user_id > 0
    ) {
      let found = false
      let i = 0

      while (i < units.length && !found) {
        if (units[i].unit_id === employee.user_unit_id) {
          unitIndex = i
          found = true
        }

        i++
      }
    }

    dispatch({
      type: UPDATE_EMPLOYEE_PRESENCES,
      payload: {
        employeeId: employee.user_id,
        checkboxIndex,
        currentUnitIndex: unitIndex
      }
    })
  }
}

const getUnitPurchases = () => {
  return async (dispatch, getState) => {
    const { units, currentUnitIndex } = getState()
    const { token } = getState().auth

    const { data: purchases } = await axiosRes.get(
      `/units/${units.data[currentUnitIndex].unit_id}/purchases`,
      { headers: { 'x-access-token': token } }
    )

    let purchasesWithInvoices = []

    if (purchases.length > 0) {
      purchasesWithInvoices = await Promise.all(
        purchases.map(async (purchase) => {
          const { data: invoice } = await axiosRes.get(
            `/purchases/${purchase.purchase_id}/invoice`,
            {
              headers: { 'x-access-token': token }
            }
          )

          return {
            ...purchase,
            invoice
          }
        })
      )
    }

    dispatch({
      type: GET_UNIT_PURCHASES,
      payload: { purchases: purchasesWithInvoices, currentUnitIndex }
    })
  }
}

const getUnitsPurchases = ({ page = 1, limit = 50 }) => {
  console.log('UNITPURCHASES')
  return async (dispatch, getState) => {
    const { units } = getState()
    const { token } = getState().auth

    if (units[0]?.purchases?.visited_pages.includes(page) ?? false)
      return {
        visited_page: [],
        purchases: units.map((unit) => unit.purchases.purchases)
      }

    const purchases = await Promise.all(
      units.map(async (unit) => {
        const { data: purchases } = await axiosRes.get(
          `/units/${unit.unit_id}/purchases?page=${page}&order=desc&limit=${limit}`,
          {
            headers: { 'x-access-token': token }
          }
        )

        let purchasesWithInvoices = []

        if (purchases.length > 0) {
          purchasesWithInvoices = await Promise.all(
            purchases.map(async (purchase) => {
              let { data: invoice } = await axiosRes.get(
                `/purchases/${purchase.purchase_id}/invoice?withInvoiceFileLink=false`,
                {
                  headers: { 'x-access-token': token }
                }
              )

              if (isObjectEmpty(invoice)) {
                try {
                  let { data } = await axiosRes.get(
                    `/purchases/${purchase.purchase_identifier}/invoice?withInvoiceFileLink=false`,
                    {
                      headers: { 'x-access-token': token }
                    }
                  )

                  invoice = data
                } catch (err) {
                  invoice = {}
                }
              }

              return {
                ...purchase,
                invoice
              }
            })
          )
        }

        return purchasesWithInvoices
      })
    )

    dispatch({
      type: GET_UNITS_PURCHASES,
      payload: { visited_page: [page], purchases }
    })
  }
}

const updateUnitPurchases = (token) => {
  return async (dispatch, getState) => {
    const { units, currentUnitIndex } = getState()
    const { token } = getState().auth

    const { data } = await axiosRes.get(
      `/ticketpurchases?unit=${units.data[currentUnitIndex].id}`,
      { headers: { 'x-access-token': token } }
    )

    dispatch({
      type: GET_PURCHASES,
      payload: { purchases: data.data, currentUnitIndex }
    })
  }
}

const getUnitBpValues = () => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units, currentUnitIndex } = getState()
    console.log('currentUnitIndex--> ', currentUnitIndex)
    console.log(units.data[currentUnitIndex].id)

    const { data: bpValues } = await axiosInstance.get(
      `/units/${units.data[currentUnitIndex].id}/bpValues`,
      { headers: { 'x-access-token': token } }
    )
    console.log('VALOR NP:', bpValues.data)
    dispatch({
      type: GET_UNITS_BPVALUES,
      payload: {
        id: units.data[currentUnitIndex].id,
        bpValues: bpValues.data
      }
    })
  }
}

const clearUnitsBalances = () => {
  return { type: CLEAR_UNITS_BALANCES }
}

const getUnitCashouts = ({ page }) => {
  return async (dispatch, getState) => {
    const { units, currentUnitIndex } = getState()
    const { token } = getState().auth

    const { data: cashouts } = await axiosRes.get(
      `/units/${units.data[currentUnitIndex].unit_id}/cashouts?page=${page}&order=desc`,
      { headers: { 'x-access-token': token } }
    )

    let cashoutsWithInvoices = []
    if (cashouts.length > 0) {
      cashoutsWithInvoices = await Promise.all(
        cashouts.map(async (cashout) => {
          const { data: invoice } = await axiosRes.get(
            `/cashouts/${cashout.cashout_id}/invoice?withInvoiceFileLink=false`,
            {
              headers: { 'x-access-token': token }
            }
          )

          return {
            ...cashout,
            invoice
          }
        })
      )
    }

    dispatch({
      type: GET_UNIT_CASHOUTS,
      payload: { cashouts: cashoutsWithInvoices, currentUnitIndex }
    })
  }
}

const getUnitInvoices = () => {
  return async (dispatch, getState) => {
    const { units, currentUnitIndex } = getState()
    const { token } = getState().auth

    const { data } = await axiosRes.get(
      `/einvoices?unit=${units.data[currentUnitIndex].id}`,
      {
        headers: { 'x-access-token': token }
      }
    )

    const invoices = await Promise.all(
      data.data.map(async (invoice) => {
        const { data } = await axiosRes({
          method: 'get',
          url: `/invoices?id=${invoice.pdf_id}`,
          responseType: 'application/pdf',
          headers: { 'x-access-token': token }
        })

        return {
          ...invoice,
          file: data
        }
      })
    )

    dispatch({
      type: GET_UNIT_INVOICES,
      payload: { invoices, currentUnitIndex }
    })
  }
}

const getUnitEmployeesBpValue = () => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units, currentUnitIndex } = getState()

    if (units.data[currentUnitIndex].employees.employees.length > 0) {
      const employeesBpInfos = await Promise.all(
        units.data[currentUnitIndex].employees.employees.map(
          async (employee) => {
            const { data: bpvalue } = await axiosUsers.get(
              `/${employee.id}/bpValue`,
              {
                headers: { 'x-access-token': token }
              }
            )
            console.log(bpvalue)

            return bpvalue
          }
        )
      )
      console.log(employeesBpInfos)
      dispatch({
        type: GET_UNIT_EMPLOYEES_BPVALUES,
        payload: { employeesBpInfos, id: units.data[currentUnitIndex].id }
      })
    }
  }
}

const getUnitBalances = () => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units, currentUnitIndex } = getState()
    console.log('getunitbalances')

    const unitId = units.data[currentUnitIndex].id
    const { data: zombieBalance } = await axiosRes.get(
      `units/${unitId}/balances`,
      {
        headers: { 'x-access-token': token }
      }
    )

    dispatch({
      type: GET_UNIT_BALANCES,
      payload: { id: unitId, balances: zombieBalance }
    })
  }
}

const addUser = (userInfo = {}) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units, currentUnitIndex } = getState()

    const unitId = units.data[currentUnitIndex].id

    console.log(units.data[currentUnitIndex].bpvalues)

    const [bpValueSelected] = units.data[currentUnitIndex].bpvalues.filter(
      (bp) => bp.ticket_value === userInfo.ticket_value
    )
    const assets = []

    console.log('Inserimento utente POST units/', unitId, 'users')
    const { data: user } = await axiosRes.post(
      `/units/${unitId}/users`,
      userInfo,
      {
        headers: { 'x-access-token': token }
      }
    )
    console.log('Id nuovo utente: ', user.userId)

    //associo il buono pasto

    if (userInfo.ticket_value !== '') {
      console.log('Associo bp POST /', user.userId, '/bpValue')
      assets.push(assetsCodeOptions[0].value)
      await axiosUsers.post(
        `/${user.userId}/bpValue`,
        { bpValueId: bpValueSelected.id },
        { headers: { 'x-access-token': token } }
      )
    }
    //Creo il newUser da inserire nello state, senza però l'id delo stellar account (per il quale dovrei fare una get sul nuovo utente creato)
    const newUser = {
      identity_code: userInfo.identity_code,
      id: user.userId,
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      username: userInfo.username,
      phone: userInfo.phone,
      created_by: userInfo.createdBy,
      status_id: 0,
      role_id: userInfo.roleId,
      reedemable_tickets: 0,
      presences: userInfo.presences
    }
    console.log('Creato utente:', newUser)

    //Creo l'account p.iva per l'utente che potrà ricaricare autonomamente il wallet personale
    if (userInfo.canRefill) {
      console.log('Creo account piva')
      await axiosRes.post(
        `units/${unitId}/users/${user.userId}/units`,
        {},
        {
          headers: { 'x-access-token': token }
        }
      )
    }

    //Aggiungo le trustline per il buono pasto e le spese di rappresentanza se selezionate
    if (userInfo.checkTsr) assets.push(assetsCodeOptions[1].value)
    if (userInfo.checkGift) assets.push(assetsCodeOptions[2].value)

    console.log('Aggiungo le trustlines seguenti: \n', assets)

    if (assets.length > 0)
      await axiosRes.post(
        `units/${unitId}/users/${user.userId}/assets`,
        assets,
        {
          headers: { 'x-access-token': token }
        }
      )

    //Setto il balance inziale a 0 per le trustline aggiunte
    const balance = assets.reduce(
      (o, key) => ({
        ...o,
        [key]: {
          value:
            key === assetsCodeOptions[0].value ? userInfo.ticket_value : 0.01,
          amount: 0,
          total_value: '0.0000000',
          is_active: false
        }
      }),
      {}
    )

    //Setto le presenze selezionate
    console.log('setto le presenze ', userInfo.presences)
    let formattedPresences = {}
    if (!isObjectEmpty(userInfo.presences))
      userInfo.presences.forEach((presence) => {
        formattedPresences[presence.backend] = presence.checked
      })
    else formattedPresences = {}
    console.log(formattedPresences)
    const presences = await axiosRes.post(
      `units/${unitId}/users/${user.userId}/weeklypresences`,
      formattedPresences,
      {
        headers: { 'x-access-token': token }
      }
    )

    dispatch({
      type: ADD_USER,
      payload: {
        newUserToInsert: {
          ...newUser,
          bpvalue: {
            unit_id: unitId,
            ticket_value: userInfo.ticket_value
          },
          presences: formattedPresences,
          balance
        },
        unitId
      }
    })
  }
}

const updateUser = (userInfo = {}) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units, currentUnitIndex } = getState()
    console.log('updateUser', userInfo)
    console.log('TICKET VALU', userInfo.ticket_value)
    const unitId = units.data[currentUnitIndex].id
    const userId = userInfo.id
    const [bpValueSelected] = units.data[currentUnitIndex].bpvalues.filter(
      (bp) => bp.ticket_value === userInfo.ticket_value
    )

    const [oldBpValue] = units.data[currentUnitIndex].bpvalues.filter(
      (bp) => bp.ticket_value === userInfo.oldBpValue
    )

    const [oldUser] = units.data[currentUnitIndex].employees.employees.filter(
      (employee) => employee.id === userId
    )

    let userBalance = oldUser.balance

    const assetsToAdd = []
    const assetsToRemove = []
    // console.log(bpValueSelected, userInfo.ticket_value)
    // console.log('Modifica utente, ', userId, ' PATCH units/', unitId, 'users')
    // console.log('MTRICOLA', userInfo.identityCode)
    try {
      const { data: user } = await axiosRes.patch(
        `units/${unitId}/users/${userId}`,
        userInfo,
        {
          headers: { 'x-access-token': token }
        }
      )

      //Setto le presenze selezionate
      console.log('setto le presenze ', userInfo.presences)
      let formattedPresences = {}
      if (!isObjectEmpty(userInfo.presences))
        userInfo.presences.forEach((presence) => {
          formattedPresences[presence.backend] = presence.checked
        })
      else formattedPresences = {}
      console.log(formattedPresences)
      console.log('setto le presenze ', formattedPresences)
      const presences = await axiosRes.patch(
        `units/${unitId}/users/${userId}/weeklypresences`,
        formattedPresences,
        {
          headers: { 'x-access-token': token }
        }
      )

      //associo il buono pasto
      if (userInfo.ticket_value !== '') {
        console.log(
          'Associo bp POST /',
          userId,
          '/bpValue',
          bpValueSelected.id,
          token
        )
        await axiosUsers.post(
          `/${userId}/bpValue`,
          { bpValueId: bpValueSelected.id },
          {
            headers: { 'x-access-token': token }
          }
        )
      }

      //Aggiungo le trustline per il buono pasto e le spese di rappresentanza se selezionate
      if (
        userInfo.checkTsr &&
        !userBalance.hasOwnProperty(assetsCodeOptions[1].value)
      )
        assetsToAdd.push(assetsCodeOptions[1].value)
      if (
        userInfo.checkBp &&
        !userBalance.hasOwnProperty(assetsCodeOptions[0].value)
      )
        assetsToAdd.push(assetsCodeOptions[0].value)
      if (
        userInfo.checkGift &&
        !userBalance.hasOwnProperty(assetsCodeOptions[2].value)
      )
        assetsToAdd.push(assetsCodeOptions[2].value)

      //Rimuovo le trustline per il buono pasto e le spese di rappresentanza se selezionate
      if (
        !userInfo.checkTsr &&
        userBalance.hasOwnProperty(assetsCodeOptions[1].value)
      ) {
        assetsToRemove.push(assetsCodeOptions[1].value)
        delete userBalance[assetsCodeOptions[1].value]
      }
      if (
        !userInfo.checkBp &&
        userBalance.hasOwnProperty(assetsCodeOptions[0].value)
      ) {
        assetsToRemove.push(assetsCodeOptions[0].value)
        delete userBalance[assetsCodeOptions[0].value]
      }
      if (
        !userInfo.checkGift &&
        userBalance.hasOwnProperty(assetsCodeOptions[2].value)
      ) {
        assetsToRemove.push(assetsCodeOptions[2].value)
        delete userBalance[assetsCodeOptions[2].value]
      }

      console.log('Rimuovo: ', assetsToRemove)
      console.log('aggiungo: , ', assetsToAdd)
      if (assetsToAdd.length > 0)
        await axiosRes.post(
          `units/${unitId}/users/${userId}/assets`,
          assetsToAdd,
          {
            headers: { 'x-access-token': token }
          }
        )

      if (assetsToRemove.length > 0)
        await axiosUsers.patch(`/${userId}/assets`, assetsToRemove, {
          headers: { 'x-access-token': token }
        })

      //Setto il balance inziale a 0 per le trustline aggiunte
      const balance = assetsToAdd.reduce(
        (o, key) => ({
          ...o,
          [key]: {
            value:
              key === assetsCodeOptions[0].value ? userInfo.ticket_value : 0.01,
            amount: 0,
            total_value: '0.0000000',
            is_active: false
          }
        }),
        {}
      )
      const mergedBalance = Object.assign({}, userBalance, balance)
      //Creo upatedUser da inserire nello state
      const updatedUser = {
        ...oldUser,
        identity_code: userInfo.identityCode,
        id: userId,
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        username: userInfo.username,
        phone: userInfo.phone,
        created_by: userInfo.createdBy,
        status_id: 0,
        role_id: userInfo.roleId,
        reedemable_tickets: 0
      }
      console.log('Aggiornato utente:', updatedUser)

      //Controllo se l'account p.iva per l'utente esiste
      console.log('PIVA: , ', userInfo.hasPiva)
      if (!isObjectEmpty(userInfo.hasPiva)) {
        await axiosRes.patch(
          `/units/${userInfo.hasPiva.id}/users/${userId}/units`,
          { newStatus: userInfo.canRefill ? 0 : 1 },
          {
            headers: { 'x-access-token': token }
          }
        )
      } else {
        if (userInfo.canRefill)
          await axiosRes.post(
            `units/${unitId}/users/${userId}/units`,
            {},
            {
              headers: { 'x-access-token': token }
            }
          )
      }

      dispatch({
        type: UPDATE_USER,
        payload: {
          updatedUserToInsert: {
            ...updatedUser,
            bpvalue: {
              unit_id: unitId,
              ticket_value:
                userInfo.ticket_value !== ''
                  ? userInfo.ticket_value
                  : oldBpValue?.ticket_value
            },
            presences: formattedPresences,
            balance: mergedBalance
          },
          unitId
        }
      })
    } catch (err) {
      console.log('UpdateUser ERR', err)
    }
    //console.log(userInfo)
  }
}

const removeUserFromUnit = (employeeId, unitId) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units, currentUnitIndex } = getState()
    console.log('Rimuovo utente ', employeeId, 'dalla unit ', unitId)
    try {
      await axiosRes.delete(`users/${employeeId}/units/${unitId}`, {
        headers: { 'x-access-token': token }
      })

      dispatch({
        type: REMOVE_EMPLOYEE_FROM_UNIT,
        payload: { employeeId, unitId }
      })
    } catch (err) {
      console.log(err)
    }
  }
}

const updateUnitEmployeeStatus = (newStatus, employeeId) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units, currentUnitIndex } = getState()
    const unitId = units.data[currentUnitIndex].id
    console.log(
      'CHIAMO CON ID',
      employeeId,
      'DI TIPO ',
      newStatus ? statUses.DISABLED : statUses.ENABLED,
      newStatus
    )
    const modifiedStatus = newStatus ? statUses.DISABLED : statUses.ENABLED
    try {
      await axiosUsers.patch(
        `/${employeeId}`,
        { statusId: modifiedStatus },
        {
          headers: { 'x-access-token': token }
        }
      )

      dispatch({
        type: UPDATE_UNIT_EMPLOYEE_STATUS,
        payload: { newStatus: modifiedStatus, unitId, employeeId }
      })
    } catch (err) {
      console.log(err)
    }
  }
}

const getUnitsOfCurrentUnit = () => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units, currentUnitIndex } = getState()

    let { data: unitsOfUnit } = await axiosRes.get(
      `/units/${units.data[currentUnitIndex].id}/units`,
      {
        headers: { 'x-access-token': token }
      }
    )

    if (units.data[currentUnitIndex].scope_id === unitScopes.MERCHANT_ADMIN) {
      unitsOfUnit.data = await Promise.all(
        unitsOfUnit.data.map(async (unit) => {
          let profilePic

          if (unit.image_id && unit.image_id !== '') {
            const { data: picBlob } = await axiosRes.get(
              `/units/${unit.id}/profilepic`,
              {
                responseType:
                  typeof window !== 'undefined' ? 'blob' : 'arraybuffer',
                headers: { 'x-access-token': token }
              }
            )

            profilePic = await readBinaryPhoto(picBlob)
          } else {
            profilePic =
              'https://toduba-public.s3.eu-south-1.amazonaws.com/default_merchant.png'
          }

          return { ...unit, profilePic }
        })
      )
    }

    dispatch({
      type: GET_CURRENT_UNIT_UNITS,
      payload: {
        units: unitsOfUnit,
        currentUnitIndex
      }
    })
  }
}

const addUnitToCurrentUnit = () => {
  return (dispatch, getState) => {
    const { units, currentUnitIndex } = getState()

    dispatch({
      type: ADD_CURRENT_UNIT_UNITS,
      payload: {
        unit: { unit_owner_id: units.data[currentUnitIndex].id },
        currentUnitIndex
      }
    })
  }
}

const deleteUnitOfCurrentUnit = (subunitIndex) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units, currentUnitIndex } = getState()

    const [unitToDelete] = units.data[currentUnitIndex].units.data.filter(
      (subunit, index) => index === subunitIndex
    )

    if (unitToDelete.id) {
      await axiosRes.delete(`/units/${unitToDelete.id}`, {
        headers: { 'x-access-token': token }
      })
    }

    dispatch({
      type: DELETE_CURRENT_UNIT_SUBUNIT,
      payload: {
        subunitIndex,
        currentUnitIndex
      }
    })
  }
}

const updateUnitOfCurrentUnit = ({ updates, subunitIndex }) => {
  return async (dispatch, getState) => {
    const { token } = getState().auth
    const { units, currentUnitIndex } = getState()

    const [unitToUpdate] = units.data[currentUnitIndex].units.data.filter(
      (subunit, index) => index === subunitIndex
    )

    let unitId
    let unitRes
    if (!unitToUpdate.id) {
      unitRes = await axiosRes.post(
        `/units/${unitToUpdate.unit_owner_id}/units`,
        updates,
        {
          headers: { 'x-access-token': token }
        }
      )

      unitId = unitRes.data.unitId
    } else {
      unitRes = await axiosRes.patch(
        `/units/${unitToUpdate.unit_owner_id}/units/${unitToUpdate.id}`,
        updates,
        { headers: { 'x-access-token': token } }
      )

      unitId = unitToUpdate.id
    }

    let unit = {
      id: unitId,
      ...unitToUpdate,
      ...decamelizeObject(updates)
    }

    if (updates.profilePic) {
      let encodedString = ''
      const reader = new FileReader()

      reader.readAsArrayBuffer(updates.profilePic)
      reader.onload = async () => {
        const binaryStr = reader.result

        encodedString = Buffer.from(binaryStr).toString('base64')

        let profilePic = `data:image/jpeg;base64,${encodedString}`

        await axiosRes.patch(
          `/units/${unitId}/profilePic`,
          { image: encodedString },
          { headers: { 'x-access-token': token } }
        )

        unit = { ...unit, profilePic }

        dispatch({
          type: UPDATE_CURRENT_UNIT_SUBUNIT,
          payload: {
            unit,
            subunitIndex,
            currentUnitIndex
          }
        })
      }
    } else {
      dispatch({
        type: UPDATE_CURRENT_UNIT_SUBUNIT,
        payload: {
          unit,
          subunitIndex,
          currentUnitIndex
        }
      })
    }
  }
}

export {
  GET_UNITS,
  UPDATE_UNIT,
  ADD_UNIT,
  DELETE_UNIT,
  GET_UNIT_CONTRACT,
  GET_UNIT_ADMIN,
  GET_UNITS_CONTRACTS,
  UPDATE_CONTRACT,
  GET_EMPLOYEES,
  GET_UNITS_EMPLOYEES,
  UPDATE_EMPLOYEES,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  ADD_ADMIN,
  REMOVE_ADMIN,
  UPDATE_ADMIN,
  UPDATE_SUBUNIT_ADMIN,
  UPDATE_UNITS_ADMINS,
  UPDATE_UNITS_EMPLOYEES,
  UPDATE_EMPLOYEE_BATCH,
  REMOVE_EMPLOYEE,
  GET_EMPLOYEES_PRESENCES,
  UPDATE_EMPLOYEE_PRESENCES,
  GET_UNIT_PURCHASES,
  GET_UNITS_PURCHASES,
  GET_UNITS_BPVALUES,
  CLEAR_UNITS_BALANCES,
  GET_UNIT_CASHOUTS,
  GET_UNIT_INVOICES,
  GET_UNITS_EMPLOYEES_ACCREDITS_HISTORY,
  GET_UNIT_EMPLOYEES_BPVALUES,
  GET_UNIT_BALANCES,
  UPDATE_EMPLOYEE_REEDEMABLE_TICKETS,
  UPDATE_UNIT_EMPLOYEE_REEDEMABLE_TICKETS,
  UPDATE_EMPLOYEES_ASSIGNALL_REEDEMABLE_TICKETS,
  ADD_USER,
  UPDATE_USER,
  UPDATE_UNIT_EMPLOYEE_STATUS,
  REMOVE_EMPLOYEE_FROM_UNIT,
  GET_CURRENT_UNIT_UNITS,
  ADD_CURRENT_UNIT_UNITS,
  DELETE_CURRENT_UNIT_SUBUNIT,
  UPDATE_CURRENT_UNIT_SUBUNIT,
  getOwnerUnits,
  updateUnit,
  deleteUnit,
  addUnit,
  getUnitAdmin,
  getUnitContract,
  getUnitsContracts,
  updateContract,
  getUnitEmployees,
  getUnitsEmployees,
  getUnitsEmployeesAccreditsHistoryInRange,
  updateUnitEmployees,
  addUnitEmployee,
  addUnitAdmin,
  updateUnitEmployee,
  updateAdmin,
  updateUnitsAdmins,
  updateSubUnitAdmin,
  updateUnitsEmployees,
  updateUnitEmployeeBatch,
  removeUnitEmployee,
  removeUnitAdmin,
  updateUnitEmployeePresences,
  getUnitPurchases,
  getUnitsPurchases,
  getUnitBpValues,
  clearUnitsBalances,
  getUnitCashouts,
  getUnitInvoices,
  getUnitEmployeesBpValue,
  getUnitBalances,
  updateEmployeeReedemableTickets,
  updateUnitEmployeesReedemableTickets,
  updateAssignAllReedemableTickets,
  addUser,
  removeUserFromUnit,
  updateUser,
  updateUnitEmployeeStatus,
  getUnitsOfCurrentUnit,
  addUnitToCurrentUnit,
  deleteUnitOfCurrentUnit,
  updateUnitOfCurrentUnit
}
