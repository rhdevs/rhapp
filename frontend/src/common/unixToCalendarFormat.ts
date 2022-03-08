/**
 *
 * @param unixDate epoch/unix date time number
 * @returns formatted time in for of (MMDD) (eg, 302 for Mar 2nd)
 */

export const unixToCalendarFormat = (unprocessedDate: number, processedDates: number[]) => {
  const month = new Date(unprocessedDate * 1000).getMonth()
  const day = new Date(unprocessedDate * 1000).getDate()
  const processedDate = month * 100 + day
  processedDates.push(processedDate)
  return processedDates
}
