/**
 *
 * @param unixDate epoch/unix date time number
 * @returns typescript Date object
 */

export const unixToDateObject = (unprocessedDate: number, processedDates: Date[]) => {
  return processedDates.push(new Date(unprocessedDate * 1000))
}
