/**
 *
 * @param unixDate epoch/unix date time number
 * @returns fomatted time in the form of HH:MM:SS  (eg, 19:00:00 or 12:10:20)
 */

export const unixToFormattedTime = (unixDate?: number) => {
  if (!unixDate) {
    return '-'
  }
  const date = new Date(unixDate * 1000)
  const hours = date.getHours()
  const minutes = '0' + date.getMinutes()
  const seconds = '0' + date.getSeconds()

  const formattedTime = hours + ':' + minutes.substring(-2) + ':' + seconds.substring(-2)

  return formattedTime
}
