import { days, months } from './dates'

export const unixToFullDateTime = (unixDate: number) => {
  const dateObj = new Date(unixDate * 1000)

  const month = months[dateObj.getMonth()].slice(0, 3)
  const date = dateObj.getDate()
  const day = days[dateObj.getDay()]
  const year = dateObj.getFullYear()
  const hours = dateObj.getHours()
  const minutes = '0' + dateObj.getMinutes()

  return `${day}, ${date} ${month} ${year} ${hours}${minutes}`
}
