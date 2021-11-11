import Papa from 'papaparse'

function readCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsBinaryString(file)

    reader.onabort = () => reject('file reading was aborted')
    reader.onerror = () => reject('file reading has failed')
    reader.onload = () => {
      // Do whatever you want with the file contents
      const fileContent = reader.result
      const { data } = Papa.parse(fileContent, { delimiter: ';' })

      // Checks if uploaded file has header
      let hasHeader =
        [
          'matricola',
          'cognome',
          'nome',
          'mail',
          'numero di telefono',
          'abilitato',
          'presenza',
          'valore del buono'
        ].filter((headerPart, i) => headerPart === data[0][i]).length > 0

      resolve(hasHeader ? data.slice(1) : data)
    }
  })
}

function readBinaryPhoto(binaryPhoto) {
  return new Promise((resolve, reject) => {
    let pic

    if (typeof window !== 'undefined') {
      let reader = new FileReader()
      reader.onload = () => {
        let b64 = reader.result
        pic = b64

        resolve(pic)
      }

      reader.readAsDataURL(binaryPhoto)
    } else {
      pic = `data:image/jpeg;base64,${Buffer.from(binaryPhoto).toString(
        'base64'
      )}`

      resolve(pic)
    }
  })
}

export { readCsvFile, readBinaryPhoto }
