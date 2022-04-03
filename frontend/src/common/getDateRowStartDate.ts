/**
 *
 * @param fullDate Date object of selected date
 * @returns the date number of the first date on the date row
 */

export const getDateRowStartDate = (fullDate: Date) => {
  const date = fullDate.getDate()
  const day = fullDate.getDay()

  if (day === 6) return date // if saturday chosen, start row on saturday instead of sunday

  if (date - day < 0) {
    // if date is on the new week of the month that doesn't start on sunday
    const year = fullDate.getFullYear()
    const month = fullDate.getMonth() // month index (0 = January)
    const maxDatePrevMonth = new Date(year, month, 0).getDate() // max date of PREVIOUS month
    return maxDatePrevMonth - (day - date) // get previous month's last sunday
  }

  return date - day // by default, date row start on sunday
}
