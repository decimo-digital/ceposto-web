import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
dayjs.extend(isLeapYear)
import XLSX from '@sheet/core'

import { formatMonthTitle } from 'utils/localeUtils'

function generateMonthReport(month, year, purchases) {
  let firstDayOfMonth = dayjs(`${year}-${month}-01T00:00:00.000Z`)

  let monthTotal = 0
  let arrayMonthHistory = purchases.map(purchase => {
    let description = purchase.purchase_stat.includes('SMART_GIFT')
      ? 'Acquisto regali per collaboratori'
      : 'Acquisto buoni pasto'

    monthTotal += purchase.purchase_tot_value

    return [
      dayjs(purchase.purchase_data).format('DD/MM/YYYY HH:mm'),
      purchase?.invoice?.einvoice_number ?? '',
      description,
      purchase.purchase_tot_value,
    ]
  })

  let reportMonth = formatMonthTitle(firstDayOfMonth.toDate(), 'it')

  let workBook = XLSX.utils.book_new()

  let workSheet = XLSX.utils.aoa_to_sheet([
    [`Estratto acquisti del mese di ${reportMonth}`],
    ['Totale', monthTotal],
    ['Numero acquisti', purchases.length],
    ['Data', 'Numero fattura', 'Descrizione', 'Importo'],
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

  workSheet['A1'].s = {
    fgColor: { rgb: '#F4EEDF' },
    bold: true,
  }
  workSheet['B2'].z = '€ #.##'
  workSheet['B2'].t = 'n'
  XLSX.utils.format_cell(workSheet['B2'])

  XLSX.utils.sheet_set_range_style(workSheet, 'A2:A3', {
    fgColor: { rgb: '#F4EEDF' },
  })
  XLSX.utils.sheet_set_range_style(workSheet, 'A4:D4', {
    fgColor: { rgb: '#F4EEDF' },
    bold: true,
    ...borderStyles,
  })

  for (let i = 0; i < arrayMonthHistory.length; i++) {
    XLSX.utils.sheet_set_range_style(workSheet, `A${i + 5}:D${i + 5}`, {
      ...borderStyles,
    })
    workSheet[`D${i + 5}`].z = '€ #.##'
    workSheet[`D${i + 5}`].t = 'n'
    XLSX.utils.format_cell(workSheet[`D${i + 5}`])
  }

  XLSX.utils.book_append_sheet(workBook, workSheet, 'Estratto del mese')

  if (!workSheet['!cols']) workSheet['!cols'] = []
  workSheet['!cols'][1] = { auto: 1 } // set the second column to auto-fit width
  workSheet['!cols'][2] = { auto: 1 } // set the second column to auto-fit width
  workSheet['!cols'][3] = { auto: 1 } // set the second column to auto-fit width

  XLSX.writeFile(workBook, `report_${firstDayOfMonth.format('YYYYMM')}.xlsx`, {
    cellStyles: true,
  })
}

export { generateMonthReport }
