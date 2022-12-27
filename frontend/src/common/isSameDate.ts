/**
 * Takes in 2 Date objects or unix timestamps, or 1 of each type, and check if both falls on the same day \
 * if you're comparing 2 timestamps just use `===` instead la pls
 *
 * @param date_1_2 Date object or unix timestamp (in miliseconds)
 * @returns `true` if both inputs' times are on the same date
 *
 * @remarks put in `new Date()` as one of the param to compare Date with `today`
 */

export const isSameDate = (date1: Date | number, date2: Date | number) => {
  const dateObj1 = typeof date1 === 'object' ? date1 : new Date(date1)
  const dateObj2 = typeof date2 === 'object' ? date2 : new Date(date2)
  return (
    dateObj1.getDate() == dateObj2.getDate() &&
    dateObj1.getMonth() == dateObj2.getMonth() &&
    dateObj1.getFullYear() == dateObj2.getFullYear()
  )
}
