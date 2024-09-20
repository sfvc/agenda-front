export const formatDate = (dateString) => {
  if (!dateString) {
    return ''
  }

  const date = new Date(dateString)
  if (isNaN(date)) {
    return ''
  }
  const timeOptions = { hour: '2-digit', minute: '2-digit' }
  const formattedDate = date.toLocaleDateString()
  const formattedTime = date.toLocaleTimeString(undefined, timeOptions)

  // const userTimezoneOffset = date.getTimezoneOffset() * 60000
  // const adjustedDate = new Date(date.getTime() + userTimezoneOffset)

  // const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  // const timeOptions = { hour: '2-digit', minute: '2-digit' }

  // const formattedDate = adjustedDate.toLocaleDateString(undefined, dateOptions)
  // const formattedTime = adjustedDate.toLocaleTimeString(undefined, timeOptions)

  return `Día del evento ${formattedDate} - Horario ${formattedTime}hs`
}
