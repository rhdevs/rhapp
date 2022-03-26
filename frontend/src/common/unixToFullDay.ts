import { days } from './dates'

/**
 *
 * @param unixDate epoch/unix date time number
 * @returns time in the form of (dd month yyyy) (eg, 27 April 2022)
 */
export const unixToFullDay = (unixDate: number) => {
  const date = new Date(unixDate * 1000)
  const day = days[date.getDay()]

  return `${day}`
}
