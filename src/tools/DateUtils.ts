export const getDate = (timestamp?: number) => {
  return timestamp ? new Date(timestamp) : new Date()
}

export const getDayName = (timestamp: number) => {
  const date = getDate(timestamp)
  return date.toLocaleDateString('fr', { weekday: 'long' })
}

export const getDateString = (timestamp?: number) => {
  const date = getDate(timestamp)
  const monthString = (date.getMonth() + 1).toString().padStart(2, '0')
  const dayString = date.getDate().toString().padStart(2, '0')
  return `${dayString}/${monthString}/${date.getFullYear()}`
}

export const getDateTimeString = (timestamp?: number) => {
  const date = getDate(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${getDateString(timestamp)} ${hours}h${minutes} ${seconds}s`
}

export const parseDate = (input: string) => {
  return getDate(Date.parse(input))
}

export const addDays = (date: Date, days: number) => {
  const result = new Date(date.getTime())
  return result.setDate(result.getDate() + days)
}

export const getDateStringForInput = (date: Date) => {
  const monthString = (date.getMonth() + 1).toString().padStart(2, '0')
  const dayString = date.getDate().toString().padStart(2, '0')
  return `${date.getFullYear()}-${monthString}-${dayString}`
}
