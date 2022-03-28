/**
 *
 * @param unixDate epoch/unix date time number
 * @returns fomatted time in the form of HH:MM AM/PM (eg, 01:00AM or 12:10PM)
 */

export const unixTo12HourTime = (unixDate?: number) => {
  if (!unixDate) {
    return '-'
  }
  const date = new Date(unixDate * 1000)
  const hours = date.getHours()
  const minuteString = `0${date.getMinutes()}`.slice(-2)
  const letterString = hours < 12 ? 'AM' : 'PM'
  const hourString = `0${hours % 12 === 0 ? '12' : hours % 12}`.slice(-2)

  const formattedTime = `${hourString}:${minuteString}${letterString}`

  return formattedTime
}
