/**
 *
 * @param unixDate epoch/unix date time number
 * @returns fomatted time in form of HHMM (eg, 1900 or 1210)
 */

export const unixTo24HourTime = (unixDate: number) => {
  const date = new Date(unixDate * 1000)
  const hour = `0${date.getHours()}`.slice(-2)
  const minutes = `0${date.getMinutes()}`.slice(-2)

  return `${hour}${minutes}`
}
