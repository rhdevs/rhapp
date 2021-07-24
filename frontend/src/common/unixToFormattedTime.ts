export const unixToFormattedTime = (unixDate?: number) => {
  if (!unixDate) {
    return '-'
  }
  const date = new Date(unixDate * 1000)
  const hours = date.getHours()
  const minutes = '0' + date.getMinutes()
  const seconds = '0' + date.getSeconds()

  const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)

  return formattedTime
}
