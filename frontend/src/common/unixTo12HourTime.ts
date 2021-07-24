/**
 *
 * @param unixDate epoch/unix date time number
 * @returns fomatted time in form of HH:MM AM/PM (eg, 01:00AM or 12:10PM)
 */

export const unixTo12HourTime = (unixDate?: number) => {
  if (!unixDate) {
    return '-'
  }
  const date = new Date(unixDate * 1000)
  let hours = '0' + date.getHours()
  const minutes = '0' + date.getMinutes()
  let letters = 'PM'

  if (Number(hours) < 12) {
    letters = 'AM'
  }
  if (Number(hours) > 12) {
    hours = '0' + (date.getHours() - 12)
  }
  if (Number(hours) === 0) {
    hours = '12'
  }

  const formattedTime = hours.substr(-2) + ':' + minutes.substr(-2) + letters

  return formattedTime
}
