
function getEmployeeUploadErrorFile(invalidEmployees) {
  let fileContent = [['utente', 'errore']]

  const fileRows = invalidEmployees.map(({ user, reason }) => {
    return [`${user}`, `${reason}`]
  })

  fileRows.forEach((fileRow) => {
    fileContent.push(fileRow)
  })

  return fileContent
}

export default getEmployeeUploadErrorFile
