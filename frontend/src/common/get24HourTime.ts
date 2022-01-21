/**
 *
 * @param eventStartTime date time number
 * @returns fomatted time in form of HH:MM:SS  (eg, 19:00:00 or 12:10:20)
 */

export const get24Hourtime = (eventStartTime: number) => {
  const date = new Date(eventStartTime * 1000)
  let hour = date.getHours().toString()
  if (hour.length == 1) {
    hour = '0' + hour
  }
  let minutes = date.getMinutes().toString()
  if (minutes.length == 1) {
    minutes = '0' + minutes
  }

  return hour + minutes
}
