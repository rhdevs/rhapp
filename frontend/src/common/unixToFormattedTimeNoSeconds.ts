export const unixToFormattedTimeNoSeconds = (unixDate?: number) => {
  if (!unixDate) {
    return '-'
  }
  const date = new Date(unixDate * 1000)
  const hours = '0' + date.getHours()
  const minutes = '0' + date.getMinutes()

  return hours.substr(-2) + ':' + minutes.substr(-2)
}
