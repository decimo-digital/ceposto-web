function isDateAnHoliday(date = new Date().getTime()) {
  let currentYear = new Date().getFullYear()

  const holidays = [
    `${currentYear}-01-01`, //capodanno
    `${currentYear}-01-06`, //epifania
    //pasqua già domenica
    `${currentYear}-04-13`, //pasquetta
    `${currentYear}-04-25`, //liberazione
    `${currentYear}-05-01`, //lavoro
    `${currentYear}-06-02`, //repubblica
    `${currentYear}-08-15`, //ferragosto
    `${currentYear}-11-01`, //tutti santi
    //'08/12/2019',	//immacolata
    `${currentYear}-12-25`, //natale
    `${currentYear}-12-26`, //santo stefno
    //'31/12/2019',	//immacolata
  ]

  for (let day of holidays) {
    const parsedDay = Date.parse(day)
    const startOfDay = new Date(parsedDay).getTime()
    const endOfDay = new Date(parsedDay + 20 * 60 * 60 * 1000).getTime()

    if (date >= startOfDay && date <= endOfDay) return true
  }

  return false
}

module.exports = { isDateAnHoliday }
