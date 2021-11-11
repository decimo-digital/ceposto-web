const dayjs = require('dayjs')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrAfter)

const months = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre'
]

function getMonthsDropdownOptions(oldestDate = dayjs()) {
  let currentDate = dayjs()
  let monthsDropdownOptions = []
  let hasDecreasedYear = false

  do {
    if (oldestDate.year() === currentDate.year()) {
      if (hasDecreasedYear) currentDate = currentDate.endOf('year')

      do {
        monthsDropdownOptions.push({
          label: `${months[currentDate.month()]} ${currentDate.year()}`,
          value: currentDate.format('YYYY-MM')
        })

        currentDate = currentDate.subtract(1, 'month')
      } while (currentDate.isSameOrAfter(oldestDate))
    } else {
      for (let i = currentDate.month(); i >= 0; i--) {
        monthsDropdownOptions.push({
          label: `${months[i]} ${currentDate.year()}`,
          value: `${currentDate.format('YYYY')}-${(i + 1)
            .toString()
            .padStart(2, '0')}`
        })
      }
    }

    currentDate = currentDate.subtract(1, 'year')

    hasDecreasedYear = true
  } while (oldestDate.year() <= currentDate.year())

  return monthsDropdownOptions
}

module.exports = { getMonthsDropdownOptions }
