export const formatBase64String = (rawString) => {
  const string = `data:image/jpeg;base64,${rawString}`

  return string
}

export const formatLocation = (location) => {
  const { place_name, street_address, city, state } = location
  const string = `${place_name}, ${street_address}, ${city}, ${state}`

  return string
}

export const formatDate = (isoDateString) => {
  const date = new Date(isoDateString)

  const day = date.getDate() + 1
  const month = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "noviembre", "diciembre"
  ][date.getMonth()]
  const year = date.getFullYear()
  const hours = (date.getHours() % 12).toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  const formatted = `${day} de ${month} de ${year} a las ${hours}:${minutes}`

  return formatted
}

export const formatCustomerName = (name, firstSurname, secondSurname) => {
  const formatted = `${name} ${firstSurname} ${secondSurname}`

  return formatted
}
