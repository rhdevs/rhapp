import { days, months } from './dates'
import { unixToFormattedTimeNoSeconds } from './unixToFormattedTimeNoSeconds'
import { unixToFullDate } from './unixToFullDate'

export const unixToFullDateTime = (unixDate: number) => {
  const dateObj = new Date(unixDate * 1000)

  const month = months[dateObj.getMonth()].slice(0, 3)
  const date = dateObj.getDate()
  const day = days[dateObj.getDay()].slice(0, 3)
  const year = dateObj.getFullYear()
  const hours = dateObj.getHours()
  const minutes = '0' + dateObj.getMinutes()
  const seconds = '0' + dateObj.getSeconds()

  return `${date} ${month} ${hours}:${minutes} (${day})`

  //   const fullDate = unixToFullDate(unixDate)
  //   const fullTime = unixToFormattedTimeNoSeconds(unixDate)

  //   return `${fullDate} ${fullTime}`
}
