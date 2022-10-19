export const onRefresh = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reload = true
      if (reload) {
        resolve('reload success')
        location.reload()
      } else {
        reject(Error('reload failed'))
      }
    }, 200)
  }).catch((err) => console.log(err))
}
