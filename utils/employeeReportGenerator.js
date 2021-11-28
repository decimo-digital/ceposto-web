import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
dayjs.extend(isLeapYear)
import XLSX from '@sheet/core'

import { formatMonthTitle } from 'utils/localeUtils'
import axiosRes from 'utils/axiosInstance'
import { isDateAnHoliday } from 'utils/isDateAnHoliday'

const days = ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM']

function generateAccreditsReport(dateRanges, employeesInfos) {
  let totTicketsAssigned = 0

  let dayHistory = employeesInfos.map(employeeInfos => {
    totTicketsAssigned += employeeInfos.accreditsHistory[dateRanges].tickets

    return {
      surname: employeeInfos.user_name_surname,
      name: employeeInfos.user_name_first,
      assignedTickets:
        employeeInfos.accreditsHistory[dateRanges].tickets == null
          ? '0'
          : employeeInfos.accreditsHistory[dateRanges].tickets,
    }
  })

  let arrayDayHistory = dayHistory.map(history => Object.values(history))

  let reportDay = dayjs.unix(dateRanges.split('-')[0]).format('DD/MM/YYYY')

  let workBook = XLSX.utils.book_new()

  let workSheet = XLSX.utils.aoa_to_sheet([
    [
      `Report assegnazioni del giorno ${reportDay} - erogati ${totTicketsAssigned} buoni`,
    ],
    ...arrayDayHistory,
  ])

  if (!workSheet['!cols']) workSheet['!cols'] = []
  workSheet['!cols'][0] = { auto: 1 } // set the second column to auto-fit width

  XLSX.utils.sheet_set_range_style(workSheet, 'A1:C1', {
    alignment: { horizontal: 'left' },
    fgColor: { rgb: '#F4EEDF' },
    bold: true,
  })

  for (let i = 2; i < employeesInfos.length + 2; i++) {
    workSheet[`A${i}`].s = { fgColor: { rgb: '#F4EEDF' } }
    workSheet[`B${i}`].s = { fgColor: { rgb: '#F4EEDF' } }

    let { v: cellValue } = workSheet[`C${i}`]

    let bgColor = '#FFFFFF'
    let textColor = '#000000'
    if (cellValue === '?') {
      bgColor = '#F1B100'
      textColor = '#000000'
    } else if (cellValue === 'P') bgColor = '#1A6731'
    else if (cellValue === 'A') bgColor = '#B21831'

    workSheet[`C${i}`].s = {
      color: { rgb: textColor },
      fgColor: { rgb: bgColor },
    }
  }

  XLSX.utils.book_append_sheet(workBook, workSheet, 'Report del giorno')

  XLSX.writeFile(
    workBook,
    `report_${dayjs(dayjs.unix(dateRanges.split('-')[0])).format(
      'YYYYMMDD'
    )}.xlsx`,
    { cellStyles: true }
  )
}

//FZ
async function generateMonthAccreditReport(month, year, employees, token){
  let firstDayOfMonth = dayjs(
    `${year}-${month.toString().padStart(2, '0')}-01T00:00:00.000Z`
  )

  const daysInMonths = [
    31,
    firstDayOfMonth.isLeapYear() ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    31,
    31,
  ]

  let arrayMonthHistory = await Promise.all(
    employees.map(async employee => {
      let endOfMonthTimestamp = firstDayOfMonth.endOf('month').unix()
      let startOfMonthTimestamp = firstDayOfMonth.startOf('month').unix()

      let range = `${startOfMonthTimestamp}-${endOfMonthTimestamp}`

      const [
        { data: ticketsHistory },
        { data: presencesHistory },
      ] = await Promise.all([
        axiosRes.get(
          `/users/${employee.user_id}/transactionsHistory?range=${range}&filter=accredits`,
          { headers: { 'x-access-token': token } }
        ),
        axiosRes.get(`/users/${employee.user_id}/presences?range=${range}`, {
          headers: { 'x-access-token': token },
        }),
      ])

      let ticketsAndPresencesOfMonth = []
      for (let i = 0; i < daysInMonths[firstDayOfMonth.month()]; i++) {
        let dayDate = dayjs(
          `${year}-${month.toString().padStart(2, '0')}-${(i + 1)
            .toString()
            .padStart(2, '0')}T00:00:00.000Z`
        )

        if (
          dayDate.day() === 0 ||
          dayDate.day() === 6 ||
          isDateAnHoliday(dayDate.unix())
        )
          ticketsAndPresencesOfMonth.push({ tickets: 0, presence: '' })
        else 
          ticketsAndPresencesOfMonth.push({ tickets: 0, presence: '?' })

      }

      let totTickets = 0
      if (ticketsHistory.transactions.length > 0) {
        for (let { date, tickets } of ticketsHistory.transactions) {
          ticketsAndPresencesOfMonth[dayjs(date).date() - 1].tickets += tickets
          totTickets += tickets
        }
      }

      if (presencesHistory.length > 0) {
        for (let { reportDatetime, presenceState } of presencesHistory) {
          let dayjsReportDatetime = dayjs(reportDatetime)

          if (
            dayjsReportDatetime.day() !== 0 &&
            dayjsReportDatetime.day() !== 6 &&
            !isDateAnHoliday(dayjsReportDatetime.unix())
          )
            ticketsAndPresencesOfMonth[
              dayjsReportDatetime.date() - 1
            ].presence = presenceState == null ? '?' : presenceState
        }
      }

      return [
        employee.user_name_surname,
        employee.user_name_first,
        totTickets,
      ]
    })
  )

  let reportMonth = formatMonthTitle(firstDayOfMonth.toDate(), 'it')

  let workBook = XLSX.utils.book_new()

  let workSheet = XLSX.utils.aoa_to_sheet([
    [
      `Report comunicazioni del mese di ${reportMonth}`,
      '-',
      'TOT.',
    ],
    ...arrayMonthHistory,
  ])

  if (!workSheet['!cols']) workSheet['!cols'] = []
  workSheet['!cols'][0] = { auto: 1 } // set the second column to auto-fit width

  let borderStyles = {
    top: { style: 'thin' },
    right: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
  }

  XLSX.utils.sheet_set_range_style(
    workSheet,
    `A1:C1`,
    {
      fgColor: { rgb: '#F4EEDF' },
      bold: true,
      ...borderStyles,
    }
  )

  for (let i = 2; i < arrayMonthHistory.length + 2; i++) {
    workSheet[`A${i}`].s = { fgColor: { rgb: '#F4EEDF' }, ...borderStyles }
    workSheet[`B${i}`].s = { fgColor: { rgb: '#F4EEDF' }, ...borderStyles }

    for (let j = 2; j < arrayMonthHistory[i - 2].length - 2; j++) {
      let { v: cellValue } = workSheet[`${lettersToColor[j - 2]}${i}`]

      let bgColor = ''
      let textColor = '#FFFFFF'
      if (cellValue === '') {
        bgColor = '#6E6E6E'
      } else if (cellValue === '?') {
        bgColor = '#F1B100'
        textColor = '#000000'
      } else if (cellValue === 'P') bgColor = '#1A6731'
      else if (cellValue === 'A') bgColor = '#B21831'

      workSheet[`${lettersToColor[j - 2]}${i}`].s = {
        color: { rgb: textColor },
        fgColor: { rgb: bgColor },
        ...borderStyles,
      }
    }
  }

  XLSX.utils.book_append_sheet(workBook, workSheet, 'Report del mese')

  XLSX.writeFile(workBook, `report_${firstDayOfMonth.format('YYYYMM')}.xlsx`, {
    cellStyles: true,
  })
}

function generateDayReport(dateRanges, day, employeesInfos) {
  let totTicketsAssigned = 0

  let dayHistory = employeesInfos.map(employeeInfos => {
    totTicketsAssigned +=
      employeeInfos.accreditsHistory[dateRanges][day].tickets

    return {
      surname: employeeInfos.user_name_surname,
      name: employeeInfos.user_name_first,
      presence:
        employeeInfos.accreditsHistory[dateRanges][day].presence == null
          ? '?'
          : employeeInfos.accreditsHistory[dateRanges][day].presence,
    }
  })

  let arrayDayHistory = dayHistory.map(history => Object.values(history))

  let reportDay = dayjs
    .unix(dateRanges.split('-')[0])
    .add(days.indexOf(day), 'day')
    .format('DD/MM/YYYY')

  let workBook = XLSX.utils.book_new()

  let workSheet = XLSX.utils.aoa_to_sheet([
    [
      `Report comunicazioni del giorno ${reportDay} - erogati ${totTicketsAssigned} buoni`,
    ],
    ...arrayDayHistory,
  ])

  if (!workSheet['!cols']) workSheet['!cols'] = []
  workSheet['!cols'][0] = { auto: 1 } // set the second column to auto-fit width

  XLSX.utils.sheet_set_range_style(workSheet, 'A1:C1', {
    alignment: { horizontal: 'left' },
    fgColor: { rgb: '#F4EEDF' },
    bold: true,
  })

  for (let i = 2; i < employeesInfos.length + 2; i++) {
    workSheet[`A${i}`].s = { fgColor: { rgb: '#F4EEDF' } }
    workSheet[`B${i}`].s = { fgColor: { rgb: '#F4EEDF' } }

    let { v: cellValue } = workSheet[`C${i}`]

    let bgColor = ''
    let textColor = '#FFFFFF'
    if (cellValue === '?') {
      bgColor = '#F1B100'
      textColor = '#000000'
    } else if (cellValue === 'P') bgColor = '#1A6731'
    else if (cellValue === 'A') bgColor = '#B21831'

    workSheet[`C${i}`].s = {
      color: { rgb: textColor },
      fgColor: { rgb: bgColor },
    }
  }

  XLSX.utils.book_append_sheet(workBook, workSheet, 'Report del giorno')

  XLSX.writeFile(
    workBook,
    `report_${dayjs(
      dayjs.unix(dateRanges.split('-')[0]).add(days.indexOf(day), 'day')
    ).format('YYYYMMDD')}.xlsx`,
    { cellStyles: true }
  )
}

const lastLetterInExcelByDay = {
  27: 'AE',
  28: 'AF',
  29: 'AG',
  30: 'AH',
  31: 'AI',
  32: 'AJ',
}

const lettersToColor = [
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'AA',
  'AB',
  'AC',
  'AD',
  'AE',
  'AF',
  'AG',
  'AH',
  'AI',
]

async function generateMonthReport(month, year, employees, token) {
  let firstDayOfMonth = dayjs(
    `${year}-${month.toString().padStart(2, '0')}-01T00:00:00.000Z`
  )

  const daysInMonths = [
    31,
    firstDayOfMonth.isLeapYear() ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    31,
    31,
  ]

  let arrayMonthHistory = await Promise.all(
    employees.map(async employee => {
      let endOfMonthTimestamp = firstDayOfMonth.endOf('month').unix()
      let startOfMonthTimestamp = firstDayOfMonth.startOf('month').unix()

      let range = `${startOfMonthTimestamp}-${endOfMonthTimestamp}`

      const [
        { data: ticketsHistory },
        { data: presencesHistory },
      ] = await Promise.all([
        axiosRes.get(
          `/users/${employee.user_id}/transactionsHistory?range=${range}&filter=accredits`,
          { headers: { 'x-access-token': token } }
        ),
        axiosRes.get(`/users/${employee.user_id}/presences?range=${range}`, {
          headers: { 'x-access-token': token },
        }),
      ])

      let ticketsAndPresencesOfMonth = []
      for (let i = 0; i < daysInMonths[firstDayOfMonth.month()]; i++) {
        let dayDate = dayjs(
          `${year}-${month.toString().padStart(2, '0')}-${(i + 1)
            .toString()
            .padStart(2, '0')}T00:00:00.000Z`
        )

        if (
          dayDate.day() === 0 ||
          dayDate.day() === 6 ||
          isDateAnHoliday(dayDate.unix())
        )
          ticketsAndPresencesOfMonth.push({ tickets: 0, presence: '' })
        else ticketsAndPresencesOfMonth.push({ tickets: 0, presence: '?' })
      }

      let totTickets = 0
      if (ticketsHistory.transactions.length > 0) {
        for (let { date, tickets } of ticketsHistory.transactions) {
          ticketsAndPresencesOfMonth[dayjs(date).date() - 1].tickets += tickets
          totTickets += tickets
        }
      }

      if (presencesHistory.length > 0) {
        for (let { reportDatetime, presenceState } of presencesHistory) {
          let dayjsReportDatetime = dayjs(reportDatetime)

          if (
            dayjsReportDatetime.day() !== 0 &&
            dayjsReportDatetime.day() !== 6 &&
            !isDateAnHoliday(dayjsReportDatetime.unix())
          )
            ticketsAndPresencesOfMonth[
              dayjsReportDatetime.date() - 1
            ].presence = presenceState == null ? '?' : presenceState
        }
      }

      return [
        employee.user_name_surname,
        employee.user_name_first,
        ...ticketsAndPresencesOfMonth.map(
          tcktAndPresence => `${tcktAndPresence?.presence ?? ''}`
        ),
        '',
        totTickets,
      ]
    })
  )

  let dayStrings = []
  for (let i = 0; i < daysInMonths[firstDayOfMonth.month()]; i++)
    dayStrings.push(`${i + 1}/${firstDayOfMonth.month() + 1}`)

  let reportMonth = formatMonthTitle(firstDayOfMonth.toDate(), 'it')

  let workBook = XLSX.utils.book_new()

  let workSheet = XLSX.utils.aoa_to_sheet([
    [
      `Report comunicazioni del mese di ${reportMonth}`,
      '',
      ...dayStrings,
      '-',
      'TOT.',
    ],
    ...arrayMonthHistory,
  ])

  if (!workSheet['!cols']) workSheet['!cols'] = []
  workSheet['!cols'][0] = { auto: 1 } // set the second column to auto-fit width

  let borderStyles = {
    top: { style: 'thin' },
    right: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
  }

  XLSX.utils.sheet_set_range_style(
    workSheet,
    `A1:${lastLetterInExcelByDay[dayStrings.length]}1`,
    {
      fgColor: { rgb: '#F4EEDF' },
      bold: true,
      ...borderStyles,
    }
  )

  for (let i = 2; i < arrayMonthHistory.length + 2; i++) {
    workSheet[`A${i}`].s = { fgColor: { rgb: '#F4EEDF' }, ...borderStyles }
    workSheet[`B${i}`].s = { fgColor: { rgb: '#F4EEDF' }, ...borderStyles }
    workSheet[`${lastLetterInExcelByDay[dayStrings.length]}${i}`].s = {
      fgColor: { rgb: '#FFFF00' },
      ...borderStyles,
    }
    workSheet[`${lastLetterInExcelByDay[dayStrings.length - 1]}${i}`].s = {
      fgColor: { rgb: '#F4EEDF' },
      ...borderStyles,
    }

    for (let j = 2; j < arrayMonthHistory[i - 2].length - 2; j++) {
      let { v: cellValue } = workSheet[`${lettersToColor[j - 2]}${i}`]

      let bgColor = ''
      let textColor = '#FFFFFF'
      if (cellValue === '') {
        bgColor = '#6E6E6E'
      } else if (cellValue === '?') {
        bgColor = '#F1B100'
        textColor = '#000000'
      } else if (cellValue === 'P') bgColor = '#1A6731'
      else if (cellValue === 'A') bgColor = '#B21831'

      workSheet[`${lettersToColor[j - 2]}${i}`].s = {
        color: { rgb: textColor },
        fgColor: { rgb: bgColor },
        ...borderStyles,
      }
    }
  }

  XLSX.utils.book_append_sheet(workBook, workSheet, 'Report del mese')

  XLSX.writeFile(workBook, `report_${firstDayOfMonth.format('YYYYMM')}.xlsx`, {
    cellStyles: true,
  })
}

export { generateAccreditsReport, generateMonthAccreditReport, generateDayReport, generateMonthReport }
