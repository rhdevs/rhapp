import { months } from './dates'

/**
 *
 * @param unixDate epoch/unix date time number
 * @returns time in the form of (dd/mm/yyyy) (eg, 27/04/2022)
 */
export const unixToFullDateNumeric = (unixDate: number) => {
  const date = new Date(unixDate * 1000)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
