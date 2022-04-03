export const unixToFormattedTimeNoSeconds = (unixDate?: number) => {
  if (!unixDate) {
    return '-'
  }
  const date = new Date(unixDate * 1000)
  const hours = `0${date.getHours()}`
  const minutes = `0${date.getMinutes()}`

  return hours.slice(-2) + ':' + minutes.slice(-2)
}
