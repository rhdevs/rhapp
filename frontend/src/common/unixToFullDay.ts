import { days } from './dates'

/**
 *
 * @param unixDate epoch/unix date time number
 * @returns day in the form of Monday, Tuesday etc
 */
export const unixToFullDay = (unixDate: number) => {
  const date = new Date(unixDate * 1000)
  const day = days[date.getDay()]

  return `${day}`
}
