import { days, months } from './dates'

/**
 * Converts a Unix timestamp to a full date and time string. \
 * Returns empty string if `unixDate` is `0`
 *
 * @param unixDate Unix timestamp in seconds
 * @returns Date in the format of `Day, DD Month YYYY at HHMM`
 */

export const unixToFullDateTime = (unixDate: number) => {
  if (unixDate === 0) return ''
  const dateObj = new Date(unixDate * 1000)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth()
  const date = dateObj.getDate()
  const day = days[dateObj.getDay()]
  const hour = `0${dateObj.getHours()}`.slice(-2)
  const minutes = `0${dateObj.getMinutes()}`.slice(-2)

  return `${day}, ${date} ${months[month]} ${year} at ${hour}${minutes}`
}
