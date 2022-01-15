import {
  GET_MERCHANTS,
  UPDATE_MERCHANT_FREE_SEATS,
  GET_MENU,
} from './actions'


const merchantsReducer = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case GET_MERCHANTS:
      return { ...state, merchants: payload.merchants }
    case UPDATE_MERCHANT_FREE_SEATS:
      return {
        ...state,
        merchants: state.merchants.map(
          merchant =>
            merchant.id === payload.merchantId
              ? {
                ...merchant, freeSeats: payload.updatedFreeSeats
              }
              : merchant
        )
      }
    case GET_MENU:
      return {
        ...state, menu: {
          id: payload.id,
          items: payload.menu
        }
      }
    // case UPDATE_UNIT:
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) =>
    //       index === payload.currentUnitIndex
    //         ? { ...unit, ...payload.unit }
    //         : unit
    //     )
    //   }
    // case DELETE_UNIT:
    //   return {
    //     data: state.data.filter((unit) => unit.id !== payload.unitId),
    //     meta: {
    //       total_count: state.data.filter((unit) => unit.id !== payload.unitId)
    //         .length
    //     }
    //   }
    // case ADD_UNIT:
    //   return {
    //     data: [...(state?.data ?? []), payload.unit],
    //     meta: { total_count: (state?.meta?.total_count ?? 0) + 1 }
    //   }
    // case GET_UNIT_CONTRACT:
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) =>
    //       index === payload.currentUnitIndex
    //         ? { ...unit, contract: payload.contract }
    //         : unit
    //     )
    //   }
    // case GET_UNITS_CONTRACTS:
    //   return { ...state, data: payload.units }
    // case UPDATE_CONTRACT:
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) =>
    //       index === payload.currentUnitIndex
    //         ? { ...unit, contract: payload.contract }
    //         : unit
    //     )
    //   }
    // case GET_UNIT_ADMIN:
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) =>
    //       index === payload.currentUnitIndex
    //         ? { ...unit, admin: payload.admin }
    //         : unit
    //     )
    //   }
    // case GET_EMPLOYEES:
    //   console.log(payload)

    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) => {
    //       if (index !== payload.currentUnitIndex) return unit

    //       const { visited_pages = [], employees = [] } = unit.employees ?? {
    //         visited_pages: [],
    //         employees: []
    //       }

    //       if (visited_pages.includes(payload.visited_page)) return unit

    //       return {
    //         ...unit,
    //         employees: {
    //           total_count: payload.total_count,
    //           visited_pages: [...visited_pages, payload.visited_page],
    //           employees: [...employees, ...payload.employees]
    //         }
    //       }
    //     })
    //   }
    // case GET_UNITS_EMPLOYEES:
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) => {
    //       const { visited_pages = [], employees = [] } = unit.employees ?? {
    //         visited_pages: [],
    //         employees: []
    //       }

    //       if (visited_pages.includes(payload.visited_page)) return unit

    //       return {
    //         ...unit,
    //         employees: {
    //           total_count: payload.employees[index].total_count,
    //           visited_pages: [...visited_pages, payload.visited_page],
    //           employees: [...employees, ...payload.employees[index].employees]
    //         }
    //       }
    //     })
    //   }
    // case GET_UNITS_EMPLOYEES_ACCREDITS_HISTORY:
    //   return payload.units
    // case ADD_EMPLOYEE: {
    //   const {
    //     user_id,
    //     user_unit_id = -1,
    //     user_enabled = true,
    //     user_name_surname = '',
    //     user_name_first = '',
    //     user_username = '',
    //     user_mob = '',
    //     user_matr_number = '',
    //     user_cod_fisc = '',
    //     presences = [1, 1, 1, 1, 1, 0, 0],
    //     redeemable_tickets = 0,
    //     redeemed_tickets = 0
    //   } = payload.employeeInfo

    //   return state.map((unit, index) => {
    //     return index === payload.currentUnitIndex
    //       ? {
    //         ...unit,
    //         employees: {
    //           ...unit.employees,
    //           total_count: unit.employees.total_count + 1,
    //           employees: [
    //             {
    //               user_id,
    //               user_unit_id:
    //                 user_unit_id === -1 ? unit.unit_id : user_unit_id,
    //               user_scope_id:
    //                 unit.unit_scope_id === unitScopes.COMPANY
    //                   ? unitScopes.EMPLOYEE
    //                   : unit.unit_scope_id === unitScopes.CITY
    //                     ? unitScopes.CITIZEN
    //                     : unitScopes.CIRCUITO_SPESA,
    //               user_inpending: false,
    //               stat_sigla: 'R',
    //               user_publickey:
    //                 unit.unit_scope_id === unitScopes.COMPANY ? '' : '-1',
    //               user_imgpath: '',
    //               user_enabled,
    //               user_name_surname,
    //               user_name_first,
    //               user_username,
    //               user_mob,
    //               user_cod_fisc,
    //               presences,
    //               user_matr_number,
    //               user_chk7: false,
    //               user_chk8: false,
    //               redeemable_tickets,
    //               redeemed_tickets
    //             },
    //             ...unit.employees.employees
    //           ]
    //         }
    //       }
    //       : unit
    //   })
    // }
    // case ADD_ADMIN: {
    //   const {
    //     email = '',
    //     name = '',
    //     surname = '',
    //     phone = '',
    //     id
    //   } = payload.adminInfo
    //   return [
    //     ...state,
    //     {
    //       ...state[0],
    //       unit_scope_id: unitScopes.PIVA,
    //       unit_id: id,
    //       unit_recapito_mail: email,
    //       admin: {
    //         user_unit_id: id,
    //         user_name_first: name,
    //         user_name_surname: surname,
    //         user_username: email,
    //         user_mob: phone
    //       }
    //     }
    //   ]
    // }
    // case UPDATE_EMPLOYEE: {
    //   return state.map((unit, index) => {
    //     return index === payload.currentUnitIndex
    //       ? {
    //         ...unit,
    //         employees: {
    //           ...unit.employees,
    //           employees: unit.employees.employees.map((employee) => {
    //             return employee.user_id === payload.employeeId
    //               ? {
    //                 ...employee,
    //                 [Object.keys(payload.updatedField)[0]]: Object.values(
    //                   payload.updatedField
    //                 )[0]
    //               }
    //               : employee
    //           })
    //         }
    //       }
    //       : unit
    //   })
    // }
    // case UPDATE_UNITS_ADMINS: {
    //   return state.map((unit) => {
    //     if (typeof unit.admin !== 'undefined') {
    //       const [newAdmin] = payload.newAdmins.filter(
    //         ({ oldId }) => unit.admin.user_id === oldId
    //       )
    //       if (typeof newAdmin !== 'undefined') {
    //         return {
    //           ...unit,
    //           admin: {
    //             ...unit.admin,
    //             ...newAdmin.fieldsToUpdate,
    //             user_id: newAdmin.newId
    //           }
    //         }
    //       }
    //     }

    //     return unit
    //   })
    // }

    // case UPDATE_ADMIN: {
    //   return state.map((unit, index) => {
    //     return index === payload.currentUnitIndex
    //       ? {
    //         ...unit,
    //         admin: {
    //           ...unit.admin,
    //           [Object.keys(payload.updatedField)[0]]: Object.values(
    //             payload.updatedField
    //           )[0]
    //         }
    //       }
    //       : unit
    //   })
    // }
    // case UPDATE_SUBUNIT_ADMIN: {
    //   return state.map((unit, index) =>
    //     index === payload.currentUnitIndex
    //       ? {
    //         ...unit,
    //         admin: {
    //           ...unit.admin,
    //           [Object.keys(payload.updatedField)[0]]: Object.values(
    //             payload.updatedField
    //           )[0]
    //         }
    //       }
    //       : unit
    //   )
    // }
    // case REMOVE_EMPLOYEE: {
    //   return state.map((unit, index) =>
    //     index === payload.currentUnitIndex
    //       ? {
    //         ...unit,
    //         employees: {
    //           ...unit.employees,
    //           employees: unit.employees.employees.filter(
    //             (employee) => employee.user_id !== payload.userId
    //           )
    //         }
    //       }
    //       : unit
    //   )
    // }
    // case REMOVE_ADMIN: {
    //   return state.filter((user, index) => index !== payload.currentUnitIndex)
    // }

    // case UPDATE_EMPLOYEES: {
    //   return state
    // }
    // case UPDATE_UNITS_EMPLOYEES: {
    //   return state.map((unit) => {
    //     return {
    //       ...unit,
    //       employees: {
    //         ...unit.employees,
    //         employees: unit.employees.employees.map((employee) => {
    //           const [newEmployee] = payload.newEmployees.filter(
    //             ({ oldId }) => employee.user_id === oldId
    //           )

    //           return typeof newEmployee !== 'undefined'
    //             ? {
    //               ...employee,
    //               ...newEmployee.fieldsToUpdate,
    //               user_id: newEmployee.newId
    //             }
    //             : employee
    //         })
    //       }
    //     }
    //   })
    // }

    // case UPDATE_EMPLOYEE_BATCH: {
    //   return {
    //     ...state,
    //     data: state.data.map((unit) => {
    //       console.log(unit.id, payload.unitId)
    //       return unit.id === payload.unitId
    //         ? {
    //           ...unit,
    //           employees: {
    //             ...unit.employees,
    //             employees: unit.employees.employees.map((employee) =>
    //               employee.username !== payload.username
    //                 ? employee
    //                 : {
    //                   ...employee,
    //                   redeemable_tickets: payload.redeemable_tickets
    //                 }
    //             )
    //           }
    //         }
    //         : { ...unit }
    //     })
    //   }
    // }
    // case GET_EMPLOYEES_PRESENCES:
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) =>
    //       index === payload.currentUnitIndex
    //         ? { ...unit, employees: payload.employees }
    //         : unit
    //     )
    //   }
    // case UPDATE_EMPLOYEE_PRESENCES: {
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) => {
    //       return index === payload.currentUnitIndex
    //         ? {
    //           ...unit,
    //           employees: {
    //             ...unit.employees,
    //             employees: unit.employees.employees.map((employee) => {
    //               return employee.user_id === payload.employeeId
    //                 ? {
    //                   ...employee,
    //                   presences: employee.presences.map(
    //                     (presence, presenceIndex) =>
    //                       presenceIndex === payload.checkboxIndex
    //                         ? presence === 0
    //                           ? 1
    //                           : 0
    //                         : presence
    //                   )
    //                 }
    //                 : employee
    //             })
    //           }
    //         }
    //         : unit
    //     })
    //   }
    // }
    // case GET_UNIT_PURCHASES:
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) =>
    //       index === payload.currentUnitIndex
    //         ? { ...unit, purchases: payload.purchases }
    //         : unit
    //     )
    //   }
    // case GET_UNITS_PURCHASES:
    //   return state.map((unit, i) => {
    //     return {
    //       ...unit,
    //       purchases: {
    //         visited_pages: [
    //           ...(unit.purchases?.visited_pages ?? []),
    //           ...payload.visited_page
    //         ],
    //         purchases: [
    //           ...(unit?.purchases?.purchases ?? []),
    //           ...payload.purchases[i]
    //         ]
    //       }
    //     }
    //   })
    // case GET_UNITS_BPVALUES:
    //   return {
    //     ...state,
    //     data: state.data.map((unit) => {
    //       return unit.id === payload.id
    //         ? {
    //           ...unit,
    //           bpvalues:
    //             typeof payload.bpValues !== 'undefined'
    //               ? payload.bpValues
    //               : {
    //                 ticket_value: 0
    //               }
    //         }
    //         : unit
    //     })
    //   }
    // case CLEAR_UNITS_BALANCES:
    //   return state.map((unit) => {
    //     if (unit.balance)
    //       return {
    //         ...unit,
    //         balance: {
    //           identifier: unit.balance.identifier,
    //           balanceplusvat: 0,
    //           balance: 0,
    //           cashoutthreshold: 0,
    //           cashoutprice: 0,
    //           fatturazione: unit.balance.fatturazione,
    //           cashout: unit.balance.cashout
    //         }
    //       }

    //     return unit
    //   })
    // case GET_UNIT_CASHOUTS:
    //   return state.map((unit, index) =>
    //     index === payload.currentUnitIndex
    //       ? {
    //         ...unit,
    //         cashouts: [...(unit?.cashouts ?? []), ...payload.cashouts]
    //       }
    //       : unit
    //   )
    // case GET_UNIT_INVOICES:
    //   return state.map((unit, index) =>
    //     index === payload.currentUnitIndex
    //       ? { ...unit, invoices: payload.invoices }
    //       : unit
    //   )
    // case GET_UNIT_EMPLOYEES_BPVALUES:
    //   return {
    //     ...state,
    //     data: state.data.map((unit) =>
    //       unit.id == payload.id
    //         ? {
    //           ...unit,
    //           employees: {
    //             ...unit.employees,
    //             employees: unit.employees.employees.map((employee, index) => {
    //               return typeof payload.employeesBpInfos[index] !==
    //                 'undefined'
    //                 ? {
    //                   ...employee,
    //                   bpvalue: payload.employeesBpInfos[index]
    //                 }
    //                 : employee
    //             })
    //           }
    //         }
    //         : unit
    //     )
    //   }
    // case GET_UNIT_BALANCES:
    //   return {
    //     ...state,
    //     data: state.data.map((unit) =>
    //       unit.id == payload.id
    //         ? {
    //           ...unit,
    //           balances: payload.balances
    //         }
    //         : unit
    //     )
    //   }
    // case UPDATE_EMPLOYEE_REEDEMABLE_TICKETS:
    //   return {
    //     ...state,
    //     data: state.data.map((unit) =>
    //       unit.id == payload.unitId
    //         ? {
    //           ...unit,
    //           employees: {
    //             ...unit.employees,
    //             employees: unit.employees.employees.map((employee) => {
    //               return employee.id == payload.employeeId
    //                 ? {
    //                   ...employee,
    //                   redeemable_tickets: payload.amount
    //                 }
    //                 : employee
    //             })
    //           }
    //         }
    //         : unit
    //     )
    //   }
    // case UPDATE_UNIT_EMPLOYEE_REEDEMABLE_TICKETS:
    //   console.log('UPDATE_UNIT_EMPLOYEE_REEDEMABLE_TICKETS')
    //   console.log(payload.redeemedTickets)
    //   return {
    //     ...state,
    //     data: state.data.map((unit) =>
    //       unit.id == payload.unitId
    //         ? {
    //           ...unit,
    //           employees: {
    //             ...unit.employees,
    //             employees: unit.employees.employees.map((employee) => {
    //               return employee.username === payload.to
    //                 ? {
    //                   ...employee,
    //                   redeemable_tickets: 0,
    //                   redeemed_tickets: {
    //                     ...employee.redeemed_tickets,
    //                     [payload.asset_code]:
    //                       payload.asset_code === assetsCodeOptions[0].value
    //                         ? Number(
    //                           employee.redeemed_tickets[
    //                           payload.asset_code
    //                           ]
    //                         ) + Number(payload.redeemedTickets)
    //                         : Number(
    //                           employee.redeemed_tickets[
    //                           payload.asset_code
    //                           ]
    //                         ) + Number(payload.redeemedTickets / 100)
    //                   }
    //                 }
    //                 : employee
    //             })
    //           }
    //         }
    //         : unit
    //     )
    //   }
    // case UPDATE_EMPLOYEES_ASSIGNALL_REEDEMABLE_TICKETS:
    //   return {
    //     ...state,
    //     data: state.data.map((unit) =>
    //       unit.id == payload.unitId
    //         ? {
    //           ...unit,
    //           employees: {
    //             ...unit.employees,
    //             employees: unit.employees.employees.map((employee) => {
    //               if (
    //                 employee.balance.hasOwnProperty(payload.ticketsType) &&
    //                 employee.balance[payload.ticketsType].is_active == true
    //               )
    //                 return {
    //                   ...employee,
    //                   redeemable_tickets: payload.reedemableTickets
    //                 }
    //               else return employee
    //             })
    //           }
    //         }
    //         : unit
    //     )
    //   }

    // case ADD_USER:
    //   return {
    //     ...state,
    //     data: state.data.map((unit) => {
    //       return unit.id === payload.unitId
    //         ? {
    //           ...unit,
    //           employees: {
    //             ...unit.employees,
    //             total_count: unit.employees.total_count + 1,
    //             employees: [
    //               payload.newUserToInsert,
    //               ...unit.employees.employees
    //             ]
    //           }
    //         }
    //         : unit
    //     })
    //   }
    // case UPDATE_USER:
    //   return {
    //     ...state,
    //     data: state.data.map((unit) => {
    //       console.log(
    //         'unit -->',
    //         unit,
    //         payload.unitId,
    //         unit.id,
    //         unit.id === payload.unitId
    //       )
    //       return unit.id === payload.unitId
    //         ? {
    //           ...unit,
    //           employees: {
    //             ...unit.employees,
    //             employees: unit.employees.employees.map((employee) => {
    //               return employee.id === payload.updatedUserToInsert.id
    //                 ? payload.updatedUserToInsert
    //                 : employee
    //             })
    //           }
    //         }
    //         : unit
    //     })
    //   }
    // case UPDATE_UNIT_EMPLOYEE_STATUS:
    //   return {
    //     ...state,
    //     data: state.data.map((unit) =>
    //       unit.id == payload.unitId
    //         ? {
    //           ...unit,
    //           employees: {
    //             ...unit.employees,
    //             employees: unit.employees.employees.map((employee) => {
    //               return employee.id == payload.employeeId
    //                 ? {
    //                   ...employee,
    //                   status_id: payload.newStatus
    //                 }
    //                 : employee
    //             })
    //           }
    //         }
    //         : unit
    //     )
    //   }
    // case REMOVE_EMPLOYEE_FROM_UNIT:
    //   return {
    //     ...state,
    //     data: state.data.map((unit) =>
    //       unit.id == payload.unitId
    //         ? {
    //           ...unit,
    //           employees: {
    //             ...unit.employees,
    //             employees: unit.employees.employees.filter(
    //               (employee) => employee.id !== payload.employeeId
    //             )
    //           }
    //         }
    //         : unit
    //     )
    //   }
    // case GET_CURRENT_UNIT_UNITS:
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) =>
    //       index === payload.currentUnitIndex
    //         ? { ...unit, units: payload.units }
    //         : unit
    //     )
    //   }
    // case ADD_CURRENT_UNIT_UNITS:
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) =>
    //       index === payload.currentUnitIndex
    //         ? {
    //           ...unit,
    //           units: {
    //             ...unit.units,
    //             data: [...unit.units.data, payload.unit]
    //           }
    //         }
    //         : unit
    //     )
    //   }
    // case DELETE_CURRENT_UNIT_SUBUNIT:
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) =>
    //       index === payload.currentUnitIndex
    //         ? {
    //           ...unit,
    //           units: {
    //             ...unit.units,
    //             data: unit.units.data.filter(
    //               (subUnit, index) => index !== payload.subunitIndex
    //             )
    //           }
    //         }
    //         : unit
    //     )
    //   }
    // case UPDATE_CURRENT_UNIT_SUBUNIT:
    //   return {
    //     ...state,
    //     data: state.data.map((unit, index) =>
    //       index === payload.currentUnitIndex
    //         ? {
    //           ...unit,
    //           units: {
    //             ...unit.units,
    //             data: unit.units.data.map((subUnit, index) =>
    //               index === payload.subunitIndex
    //                 ? { ...subUnit, ...payload.unit }
    //                 : subUnit
    //             )
    //           }
    //         }
    //         : unit
    //     )
    //   }
    default:
      return state
  }
}

export default merchantsReducer
