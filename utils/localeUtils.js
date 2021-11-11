const WEEKDAYS_LONG = {
  en: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  it: [
    'Domenica',
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
  ],
}
const WEEKDAYS_SHORT = {
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  it: ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'],
}
const MONTHS = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  it: [
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
    'Dicembre',
  ],
}

const FIRST_DAY = {
  en: 0,
  it: 1, // Use Monday as first day of the week
}

function formatDay(d, locale = 'en') {
  return `${WEEKDAYS_LONG[locale][d.getDay()]}, ${d.getDate()} ${
    MONTHS[locale][d.getMonth()]
  } ${d.getFullYear()}`
}

function formatMonthTitle(d, locale = 'en') {
  return `${MONTHS[locale][d.getMonth()]} ${d.getFullYear()}`
}

function formatWeekdayShort(i, locale) {
  return WEEKDAYS_SHORT[locale][i]
}

function formatWeekdayLong(i, locale) {
  return WEEKDAYS_SHORT[locale][i]
}

function getFirstDayOfWeek(locale) {
  return FIRST_DAY[locale]
}

export {
  formatDay,
  formatMonthTitle,
  formatWeekdayLong,
  formatWeekdayShort,
  getFirstDayOfWeek,
}
